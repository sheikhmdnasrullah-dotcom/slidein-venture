import { createServiceClient } from "@/lib/supabase/server";
import { verifyInternalSecret } from "@/lib/auth/verify-internal-secret";

export async function POST(request: Request) {
  if (!verifyInternalSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const body = await request.json().catch(() => ({}));

  const { id, type, title, body: content, status = "proposed", source = "terminal", author = "terminal", tags = [] } = body as {
    id?: string;
    type?: string;
    title?: string;
    body?: string;
    status?: string;
    source?: string;
    author?: string;
    tags?: string[];
  };

  if (!id || !type || !title) {
    return Response.json({ error: "id, type, and title are required" }, { status: 400 });
  }

  const { error } = await supabase.from("knowledge_items").upsert({
    id,
    type,
    title,
    slug: id,
    content_path: `terminal://${id}`,
    body: content ?? "",
    status,
    source,
    author,
    tags,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ id, status: "created" }, { status: 201 });
}
