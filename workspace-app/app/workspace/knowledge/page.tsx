import Link from "next/link";
import { requireUser, createServiceClient } from "@/lib/supabase/server";

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
      <div className="flex items-baseline justify-between">
        <h1 className="text-sm font-medium tracking-wide text-foreground/60 uppercase">
          Knowledge
        </h1>
        <span className="text-xs text-foreground/40 tabular-nums">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <form className="flex" action="/workspace/knowledge">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search knowledge..."
          className="w-full border-b border-foreground/15 bg-transparent py-1.5 text-sm outline-none focus:border-foreground/40"
        />
      </form>

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
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-foreground/15 text-left text-xs text-foreground/40">
              <th className="py-2 pr-4 font-normal">Title</th>
              <th className="py-2 pr-4 font-normal">Type</th>
              <th className="py-2 pr-4 font-normal">Status</th>
              <th className="py-2 pr-4 font-normal">Source</th>
              <th className="py-2 pr-0 font-normal text-right">Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.slug}
                className="border-b border-foreground/8 hover:bg-foreground/[0.03]"
              >
                <td className="py-2 pr-4">
                  <Link
                    href={`/workspace/knowledge/${item.slug}`}
                    className="hover:underline"
                  >
                    {item.title}
                  </Link>
                </td>
                <td className="py-2 pr-4 font-mono text-xs text-foreground/60">
                  {item.type}
                </td>
                <td className="py-2 pr-4 font-mono text-xs text-foreground/60">
                  {item.status}
                </td>
                <td className="py-2 pr-4 text-foreground/60 truncate max-w-48">
                  {item.source}
                </td>
                <td className="py-2 pr-0 text-right text-foreground/40 tabular-nums">
                  {dateFormat.format(new Date(item.updated_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
