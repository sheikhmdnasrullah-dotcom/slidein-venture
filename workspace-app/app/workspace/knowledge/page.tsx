import Link from "next/link";
import { requireUser, createServiceClient } from "@/lib/supabase/server";
import { uploadPdf } from "./actions";
import { AnimatedSection } from "@/components/knowledge/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type KnowledgeRow = {
  slug: string;
  type: string;
  title: string;
  status: string;
  source: string;
  updated_at: string;
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default async function KnowledgeListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireUser();
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  // ponytail: knowledge_items has RLS enabled with no read policy yet, so
  // the anon/session client returns nothing even for authenticated users.
  // Reading via service role here — page is already gated by requireUser().
  // Add `create policy "authenticated read" on knowledge_items for select
  // to authenticated using (true);` to switch this to the session client.
  const supabase = createServiceClient();

  let dbQuery = supabase
    .from("knowledge_items")
    .select("slug, type, title, status, source, updated_at")
    .order("updated_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.textSearch("search_vector", query, {
      type: "websearch",
      config: "english",
    });
  }

  const { data, error } = await dbQuery;
  const items = (data ?? []) as KnowledgeRow[];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl">
      <AnimatedSection className="flex items-baseline justify-between">
        <h1 className="text-sm font-medium tracking-wide text-foreground/60 uppercase">
          Knowledge
        </h1>
        <span className="text-xs text-foreground/40 tabular-nums">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </AnimatedSection>

      <AnimatedSection className="flex flex-col gap-4">
        <form className="flex" action="/workspace/knowledge">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search knowledge..."
            className="w-full border-b border-foreground/15 bg-transparent py-1.5 text-sm outline-none focus:border-signal"
          />
        </form>

        <Card>
          <CardContent>
            <form
              action={uploadPdf}
              className="flex flex-wrap items-end gap-3 text-sm"
            >
              <div className="flex flex-col gap-1">
                <label className="text-xs text-foreground/40">PDF</label>
                <input type="file" name="file" accept="application/pdf" required className="text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-foreground/40">Title</label>
                <input
                  type="text"
                  name="title"
                  className="border-b border-foreground/15 bg-transparent py-1 outline-none focus:border-signal"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-foreground/40">Type</label>
                <select
                  name="type"
                  defaultValue="research"
                  className="border-b border-foreground/15 bg-transparent py-1 outline-none focus:border-signal"
                >
                  <option value="research">research</option>
                  <option value="prospects">prospects</option>
                  <option value="sops">sops</option>
                  <option value="decisions">decisions</option>
                  <option value="system">system</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-foreground/40">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  className="border-b border-foreground/15 bg-transparent py-1 outline-none focus:border-signal"
                />
              </div>
              <Button type="submit" className="bg-brand text-white hover:bg-brand/85">
                Upload
              </Button>
            </form>
          </CardContent>
        </Card>
      </AnimatedSection>

      {error && (
        <p className="text-sm text-foreground/60">
          Couldn&apos;t load knowledge items: {error.message}
        </p>
      )}

      {!error && items.length === 0 && (
        <p className="text-sm text-foreground/40">
          {query ? `No results for "${query}".` : "No knowledge items yet."}
        </p>
      )}

      {!error && items.length > 0 && (
        <AnimatedSection delay={0.1}>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell className="whitespace-normal">
                      <Link
                        href={`/workspace/knowledge/${item.slug}`}
                        className="hover:underline"
                      >
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-brand/30 bg-brand-soft text-signal"
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.status}</Badge>
                    </TableCell>
                    <TableCell className="max-w-48 truncate text-foreground/60">
                      {item.source}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-foreground/40">
                      {dateFormat.format(new Date(item.updated_at))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </AnimatedSection>
      )}
    </div>
  );
}
