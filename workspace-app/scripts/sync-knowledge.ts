import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");

const REQUIRED_FIELDS = [
  "id",
  "type",
  "title",
  "tags",
  "status",
  "source",
  "author",
] as const;

type Row = {
  id: string;
  type: string;
  title: string;
  slug: string;
  content_path: string;
  body: string;
  status: string;
  source: string;
  author: string;
  tags: string[];
};

async function findMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => path.join(e.parentPath ?? e.path, e.name));
}

function toRow(filePath: string, raw: string): Row | { error: string } {
  const { data, content } = matter(raw);

  const missing = REQUIRED_FIELDS.filter((field) => data[field] === undefined);
  if (missing.length > 0) {
    return { error: `missing frontmatter field(s): ${missing.join(", ")}` };
  }
  if (!Array.isArray(data.tags)) {
    return { error: "frontmatter 'tags' must be a list" };
  }

  const slug = path.basename(filePath, ".md");

  return {
    id: String(data.id),
    type: String(data.type),
    title: String(data.title),
    slug,
    content_path: path.relative(process.cwd(), filePath),
    body: content.trim(),
    status: String(data.status),
    source: String(data.source),
    author: String(data.author),
    tags: data.tags,
  };
}

function rowsDiffer(existing: Record<string, unknown>, next: Row): boolean {
  const fields: (keyof Row)[] = [
    "type",
    "title",
    "slug",
    "content_path",
    "body",
    "status",
    "source",
    "author",
    "tags",
  ];
  return fields.some((field) => {
    const a = existing[field];
    const b = next[field];
    return Array.isArray(b) ? JSON.stringify(a) !== JSON.stringify(b) : a !== b;
  });
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const files = await findMarkdownFiles(KNOWLEDGE_DIR);

  const created: string[] = [];
  const updated: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];
  const seenIds = new Map<string, string>();

  for (const filePath of files) {
    const relPath = path.relative(process.cwd(), filePath);
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = toRow(filePath, raw);

    if ("error" in parsed) {
      console.log(`FAILED  ${relPath}: ${parsed.error}`);
      failed.push(relPath);
      continue;
    }

    const dupeOf = seenIds.get(parsed.id);
    if (dupeOf) {
      console.log(`FAILED  ${relPath}: duplicate id '${parsed.id}' also used by ${dupeOf}`);
      failed.push(relPath);
      continue;
    }
    seenIds.set(parsed.id, relPath);

    const { data: existing, error: fetchError } = await supabase
      .from("knowledge_items")
      .select("type, title, slug, content_path, body, status, source, author, tags")
      .eq("id", parsed.id)
      .maybeSingle();

    if (fetchError) {
      console.log(`FAILED  ${relPath}: ${fetchError.message}`);
      failed.push(relPath);
      continue;
    }

    if (!existing) {
      const { error } = await supabase.from("knowledge_items").insert(parsed);
      if (error) {
        console.log(`FAILED  ${relPath}: ${error.message}`);
        failed.push(relPath);
        continue;
      }
      console.log(`CREATED ${relPath} (${parsed.id})`);
      created.push(relPath);
      continue;
    }

    if (!rowsDiffer(existing, parsed)) {
      console.log(`SKIPPED ${relPath} (${parsed.id}) — unchanged`);
      skipped.push(relPath);
      continue;
    }

    const { error } = await supabase
      .from("knowledge_items")
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq("id", parsed.id);
    if (error) {
      console.log(`FAILED  ${relPath}: ${error.message}`);
      failed.push(relPath);
      continue;
    }
    console.log(`UPDATED ${relPath} (${parsed.id})`);
    updated.push(relPath);
  }

  console.log("");
  console.log(
    `Done. ${created.length} created, ${updated.length} updated, ${skipped.length} skipped, ${failed.length} failed.`
  );

  if (failed.length > 0) {
    process.exit(1);
  }
}

main();
