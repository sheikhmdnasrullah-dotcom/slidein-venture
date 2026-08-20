import { createServiceClient, getSessionUser } from "@/lib/supabase/server";

// PostgREST or() filters split on top-level commas/parens; wrapping the value
// in double quotes protects those characters, so only backslash and the
// quote itself need escaping. See https://postgrest.org/en/stable/references/api/tables_views.html#operators
function escapeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().slice(0, 200);

  let data: any[] = [];

  try {
    let dbQuery = supabase
      .from("knowledge_items")
      .select("id, slug, type, title, status, source, updated_at, body")
      .limit(50);

    if (query) {
      const q = escapeFilterValue(query);
      dbQuery = dbQuery.or(`title.ilike."%${q}%",body.ilike."%${q}%",tags.cs.{"${q}"}`);
    }

    const result = await dbQuery.order("updated_at", { ascending: false });
    data = result.data ?? [];
  } catch {
    // Supabase unreachable; return empty results
  }

  return Response.json(data);
}
