import { createServiceClient, getSessionUser } from "@/lib/supabase/server";

const PAGE_SIZE = 50;
const MAX_CANDIDATES = 200;

// PostgREST or() filters split on top-level commas/parens; wrapping the value
// in double quotes protects those characters, so only backslash and the
// quote itself need escaping. See https://postgrest.org/en/stable/references/api/tables_views.html#operators
function escapeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// Escapes ILIKE wildcard characters so a fuzzy-fallback query can't be used
// to widen its own match pattern.
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

type Filters = {
  type: string | null;
  status: string | null;
  tag: string | null;
  dateFrom: string | null;
  dateTo: string | null;
};

function readFilters(searchParams: URLSearchParams): Filters {
  return {
    type: searchParams.get("type"),
    status: searchParams.get("status"),
    tag: searchParams.get("tag"),
    dateFrom: searchParams.get("dateFrom"),
    dateTo: searchParams.get("dateTo"),
  };
}

function hasFilters(filters: Filters): boolean {
  return Object.values(filters).some((v) => v);
}

// Resolves type/status/tag/date filters to a list of matching knowledge_item
// ids, so chunk queries can narrow with a single .in(). Returns null when no
// filters are set (meaning: don't narrow).
async function resolveFilteredItemIds(
  supabase: ReturnType<typeof createServiceClient>,
  filters: Filters
): Promise<string[] | null> {
  if (!hasFilters(filters)) return null;

  let query = supabase.from("knowledge_items").select("id").limit(1000);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.tag) query = query.contains("tags", [filters.tag]);
  if (filters.dateFrom) query = query.gte("updated_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("updated_at", filters.dateTo);

  const { data } = await query;
  return (data ?? []).map((row) => row.id as string);
}

async function recordSearchHistory(
  supabase: ReturnType<typeof createServiceClient>,
  userEmail: string,
  query: string,
  mode: string,
  resultCount: number
) {
  if (!query) return;
  try {
    await supabase.from("knowledge_search_history").insert({
      user_email: userEmail,
      query,
      mode,
      result_count: resultCount,
    });
  } catch {
    // history is a convenience feature, not load-bearing — don't fail the search over it
  }
}

async function searchExact(
  supabase: ReturnType<typeof createServiceClient>,
  query: string,
  page: number,
  filters: Filters
) {
  const itemIds = await resolveFilteredItemIds(supabase, filters);
  if (itemIds !== null && itemIds.length === 0) {
    return { total: 0, results: [] };
  }

  const offset = (page - 1) * PAGE_SIZE;
  const rangeEnd = Math.min(offset + PAGE_SIZE - 1, MAX_CANDIDATES - 1);

  const selectCols =
    "id, knowledge_item_id, chunk_index, heading, text, start_offset, end_offset, knowledge_items(slug, title, type, source, status, updated_at)";

  let ftsQuery = supabase
    .from("knowledge_chunks")
    .select(selectCols, { count: "exact" })
    .textSearch("search_vector", query, { type: "websearch", config: "english" })
    .range(offset, rangeEnd);
  if (itemIds) ftsQuery = ftsQuery.in("knowledge_item_id", itemIds);

  const ftsResult = await ftsQuery;

  if ((ftsResult.count ?? 0) > 0) {
    return { total: ftsResult.count ?? 0, results: ftsResult.data ?? [] };
  }

  // No FTS hits (e.g. a typo, or a term tsvector wouldn't stem to) — fall
  // back to a trigram-indexed substring match for typo tolerance.
  let likeQuery = supabase
    .from("knowledge_chunks")
    .select(selectCols, { count: "exact" })
    .ilike("text", `%${escapeLike(query)}%`)
    .range(offset, rangeEnd);
  if (itemIds) likeQuery = likeQuery.in("knowledge_item_id", itemIds);

  const likeResult = await likeQuery;
  return { total: likeResult.count ?? 0, results: likeResult.data ?? [] };
}

async function searchItems(
  supabase: ReturnType<typeof createServiceClient>,
  query: string,
  filters: Filters
) {
  let dbQuery = supabase
    .from("knowledge_items")
    .select("id, slug, type, title, status, source, updated_at, body")
    .limit(50);

  if (query) {
    const q = escapeFilterValue(query);
    dbQuery = dbQuery.or(`title.ilike."%${q}%",body.ilike."%${q}%",tags.cs.{"${q}"}`);
  }
  if (filters.type) dbQuery = dbQuery.eq("type", filters.type);
  if (filters.status) dbQuery = dbQuery.eq("status", filters.status);
  if (filters.tag) dbQuery = dbQuery.contains("tags", [filters.tag]);
  if (filters.dateFrom) dbQuery = dbQuery.gte("updated_at", filters.dateFrom);
  if (filters.dateTo) dbQuery = dbQuery.lte("updated_at", filters.dateTo);

  const result = await dbQuery.order("updated_at", { ascending: false });
  return result.data ?? [];
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().slice(0, 200);
  const mode = searchParams.get("mode") === "items" ? "items" : "exact";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const filters = readFilters(searchParams);

  try {
    if (mode === "items") {
      const results = await searchItems(supabase, query, filters);
      return Response.json({ mode, query, results });
    }

    if (!query) {
      return Response.json({ mode, query, total: 0, page, pageSize: PAGE_SIZE, results: [] });
    }

    const { total, results } = await searchExact(supabase, query, page, filters);
    if (user.email) {
      await recordSearchHistory(supabase, user.email, query, mode, total);
    }
    return Response.json({ mode, query, total, page, pageSize: PAGE_SIZE, results });
  } catch {
    // Supabase unreachable; return empty results
    return Response.json({ mode, query, total: 0, page, pageSize: PAGE_SIZE, results: [] });
  }
}
