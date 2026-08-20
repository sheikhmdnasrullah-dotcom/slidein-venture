import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();

  let data: any[] = [];

  try {
    let dbQuery = supabase
      .from("knowledge_items")
      .select("id, slug, type, title, status, source, updated_at, body")
      .limit(50);

    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,body.ilike.%${query}%,tags.cs.{${query}}`);
    }

    const result = await dbQuery.order("updated_at", { ascending: false });
    data = result.data ?? [];
  } catch {
    // Supabase unreachable; return empty results
  }

  return Response.json(data);
}
