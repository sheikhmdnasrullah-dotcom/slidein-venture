"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

export function KnowledgeSearchPanel({ initialItems }: { initialItems: KnowledgeItem[] }) {
  const [items, setItems] = useState<KnowledgeItem[]>(initialItems);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    const q = query.trim();
    if (!q) {
      setItems(initialItems);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge/search?q=${encodeURIComponent(q)}`, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as KnowledgeItem[];
        setItems(data);
      } else {
        toast.error("Search failed");
      }
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  }, [query, initialItems]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim().length >= 3) {
        search();
      } else if (query.trim().length === 0) {
        setItems(initialItems);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, search, initialItems]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search knowledge base..."
          className="h-8 w-64 text-xs"
        />
        <Button size="sm" variant="outline" onClick={search} disabled={loading}>
          {loading ? <Loader2 className="size-3 animate-spin" /> : <Search className="size-3" />}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {query ? "No items match your search." : "No knowledge items yet. Run `npm run sync` to import from the knowledge/ folder."}
        </p>
      ) : (
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
