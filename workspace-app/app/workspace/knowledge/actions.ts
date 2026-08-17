"use server";

import { revalidatePath } from "next/cache";
import { PDFParse } from "pdf-parse";
import { requireUser, createServiceClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uploadPdf(formData: FormData) {
  const user = await requireUser();

  const file = formData.get("file") as File | null;
  const title = ((formData.get("title") as string) || "").trim();
  const type = ((formData.get("type") as string) || "research").trim();
  const tags = ((formData.get("tags") as string) || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!file || file.type !== "application/pdf") {
    throw new Error("Please upload a PDF file.");
  }

  const supabase = createServiceClient();
  const baseSlug = slugify(title || file.name.replace(/\.pdf$/i, ""));

  let slug = baseSlug;
  for (let n = 2; ; n++) {
    const { data } = await supabase
      .from("knowledge_items")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) break;
    slug = `${baseSlug}-${n}`;
  }

  const today = new Date().toISOString().slice(0, 10);
  const { count } = await supabase
    .from("knowledge_items")
    .select("id", { count: "exact", head: true })
    .eq("type", type)
    .like("id", `${type}-${today}-%`);
  const id = `${type}-${today}-${String((count ?? 0) + 1).padStart(3, "0")}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const storagePath = `${slug}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("knowledge-files")
    .upload(storagePath, buffer, { contentType: "application/pdf" });
  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();
  await parser.destroy();

  const { error: insertError } = await supabase.from("knowledge_items").insert({
    id,
    type,
    title: title || file.name,
    slug,
    content_path: storagePath,
    file_path: storagePath,
    content_type: "pdf",
    body: text,
    status: "proposed",
    source: `Uploaded PDF: ${file.name}`,
    author: user.email,
    tags,
  });
  if (insertError) {
    throw new Error(`Database insert failed: ${insertError.message}`);
  }

  revalidatePath("/workspace/knowledge");
}
