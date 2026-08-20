"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, RefreshCw, X } from "lucide-react";
import { syncKnowledgeBase } from "@/app/actions/sync-knowledge";
import { ExactSearchResults, type ChunkHit } from "@/components/knowledge/exact-search-results";

type KnowledgeItem = {
  id: string;
  slug: string;
  type: string;
  title: string;
  status: string;
  source: string;
  updated_at: string;
};

type SearchHistoryEntry = {
  id: string;
  query: string;
  mode: string;
  result_count: number;
  created_at: string;
};

type Mode = "exact" | "items";

const PAGE_SIZE = 50;

export function KnowledgeSearchPanel({ initialItems }: { initialItems?: KnowledgeItem[] }) {
  const [mode, setMode] = useState<Mode>("exact");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<KnowledgeItem[]>(initialItems ?? []);
  const [exactResult, setExactResult] = useState<{
    total: number;
    page: number;
    pageSize: number;
    results: ChunkHit[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [recent, setRecent] = useState<SearchHistoryEntry[]>([]);

  useEffect(() => {
    setItems(initialItems ?? []);
  }, [initialItems]);

  const loadRecent = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge/search-history", { cache: "no-store" });
      if (res.ok) setRecent((await res.json()) as SearchHistoryEntry[]);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  const search = useCallback(
    async (q: string, searchMode: Mode, page: number) => {
      if (!q) {
        setExactResult(null);
        setItems(initialItems ?? []);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({ q, mode: searchMode, page: String(page) });
        const res = await fetch(`/api/knowledge/search?${params}`, { cache: "no-store" });
        if (!res.ok) {
          toast.error("Search failed");
          return;
        }
        const data = await res.json();
        if (searchMode === "exact") {
          setExactResult({ total: data.total, page: data.page, pageSize: data.pageSize, results: data.results });
        } else {
          setItems(data.results ?? []);
        }
        loadRecent();
      } catch {
        toast.error("Search failed");
      } finally {
        setLoading(false);
      }
    },
    [initialItems, loadRecent]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const q = query.trim();
      if (q.length >= 3) {
        search(q, mode, 1);
      } else if (q.length === 0) {
        setExactResult(null);
        setItems(initialItems ?? []);
      }
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, mode]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncKnowledgeBase();
      if (result.success) {
        toast.success(`Synced: ${result.output}`);
        window.location.reload();
      } else {
        toast.error(result.output ?? "Sync failed");
      }
    } catch {
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const runRecent = (entry: SearchHistoryEntry) => {
    setMode(entry.mode === "items" ? "items" : "exact");
    setQuery(entry.query);
    search(entry.query, entry.mode === "items" ? "items" : "exact", 1);
  };

  const removeRecent = async (id: string) => {
    await fetch(`/api/knowledge/search-history?id=${id}`, { method: "DELETE" });
    loadRecent();
  };

  const clearRecent = async () => {
    await fetch("/api/knowledge/search-history", { method: "DELETE" });
    loadRecent();
  };

  const activeQuery = query.trim();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search knowledge base..."
          className="h-8 w-64 text-xs"
        />
        <Button size="sm" variant="outline" onClick={() => search(activeQuery, mode, 1)} disabled={loading}>
          {loading ? <Loader2 className="size-3 animate-spin" /> : <Search className="size-3" />}
        </Button>
        <div className="flex overflow-hidden rounded-md border border-foreground/10">
          <button
            type="button"
            onClick={() => setMode("exact")}
            className={`px-2 py-1 text-xs ${mode === "exact" ? "bg-brand-soft text-signal" : "text-foreground/50"}`}
          >
            Exact
          </button>
          <button
            type="button"
            onClick={() => setMode("items")}
            className={`px-2 py-1 text-xs ${mode === "items" ? "bg-brand-soft text-signal" : "text-foreground/50"}`}
          >
            Items
          </button>
        </div>
        <Button size="sm" variant="outline" onClick={handleSync} disabled={syncing}>
          {syncing ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
        </Button>
      </div>

      {recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 text-xs text-foreground/40">
          <span>Recent:</span>
          {recent.map((entry) => (
            <span
              key={entry.id}
              className="flex items-center gap-1 rounded-md border border-foreground/10 px-2 py-0.5"
            >
              <button type="button" onClick={() => runRecent(entry)} className="hover:underline">
                {entry.query}
              </button>
              <button type="button" onClick={() => removeRecent(entry.id)} aria-label="Remove">
                <X className="size-3" />
              </button>
            </span>
          ))}
          <button type="button" onClick={clearRecent} className="hover:underline">
            Clear
          </button>
        </div>
      )}

      {mode === "exact" && activeQuery ? (
        exactResult ? (
          <ExactSearchResults
            query={activeQuery}
            total={exactResult.total}
            page={exactResult.page}
            pageSize={exactResult.pageSize}
            results={exactResult.results}
            onPageChange={(page) => search(activeQuery, "exact", page)}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Type at least 3 characters to search.</p>
        )
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {activeQuery ? "No items match your search." : "No knowledge items yet. Run `npm run sync` to import from the knowledge/ folder."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div className="flex flex-col gap-1">
                  <Link href={`/knowledge/${item.slug}`} className="text-sm hover:underline">
                    {item.title}
                  </Link>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-brand/30 bg-brand-soft text-signal">
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
