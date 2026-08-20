import Link from "next/link";
import { requireUser, createServiceClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function KnowledgePage() {
  await requireUser();

  // ponytail: same RLS gap as /strategy — service role, page is already
  // gated by requireUser().
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("id, slug, type, title, status, source, updated_at")
    .order("updated_at", { ascending: false });

  const items = data ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-sm font-medium tracking-wide text-foreground/60 uppercase">
          Knowledge Base
        </h1>
        <span className="text-xs text-foreground/40 tabular-nums">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {error && (
        <p className="text-sm text-foreground/60">
          Couldn&apos;t load items: {error.message}
        </p>
      )}

      {!error && items.length === 0 && (
        <p className="text-sm text-foreground/40">No knowledge items yet.</p>
      )}

      {!error && items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/knowledge/${item.slug}`}
                    className="text-sm hover:underline"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-brand/30 bg-brand-soft text-signal"
                    >
                      {item.type}
                    </Badge>
                    <span className="text-xs text-foreground/40">{item.status}</span>
                    <span className="truncate text-xs text-foreground/40">{item.source}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
