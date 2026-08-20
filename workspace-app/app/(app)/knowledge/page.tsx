"use client";

import { useCallback, useEffect, useState } from "react";
import { requireUser, createServiceClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

type KnowledgeItem = {
  id: string;
  slug: string;
  type: string;
  title: string;
  status: string;
  source: string;
  updated_at: string;
};

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createServiceClient();
      let query = supabase
        .from("knowledge_items")
        .select("id, slug, type, title, status, source, updated_at")
        .order("updated_at", { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery.trim()}%,body.ilike.%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setItems(data ?? []);
    } catch (error) {
      console.error("Failed to load knowledge items:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-medium tracking-wide text-foreground/60 uppercase">
            Knowledge Base
          </h1>
          <p className="text-xs text-foreground/40">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge base..."
            className="h-8 w-64 text-xs"
          />
          <Button size="sm" variant="outline" onClick={loadItems} disabled={loading}>
            {loading ? <Loader2 className="size-3 animate-spin" /> : <Search className="size-3" />}
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {searchQuery ? "No items match your search." : "No knowledge items yet. Run `npm run sync` to import from the knowledge/ folder."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div className="flex flex-col gap-1">
                  <a
                    href={`/knowledge/${item.slug}`}
                    className="text-sm hover:underline"
                  >
                    {item.title}
                  </a>
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
