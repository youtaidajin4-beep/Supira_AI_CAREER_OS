"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { CACard } from "@/components/cas/CACard";
import { CASummaryStrip } from "@/components/cas/CASummaryStrip";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { CAUser, CAPerformanceStatus } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

type FilterKey = "all" | CAPerformanceStatus;

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "needs_support", label: "要支援" },
  { key: "good", label: "安定" },
  { key: "excellent", label: "好調" },
];

export default function CAListPage() {
  const [cas, setCas] = useState<CAUser[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    void fetchJson<CAUser[]>("/api/cas", {
      fallback: () => clientMockFallback.cas(),
    }).then(setCas);
  }, []);

  const filtered = useMemo(() => {
    let list = cas.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    if (filter !== "all") {
      list = list.filter((c) => c.performanceStatus === filter);
    }
    return [...list].sort((a, b) => {
      if (a.performanceStatus === "needs_support" && b.performanceStatus !== "needs_support")
        return -1;
      if (b.performanceStatus === "needs_support" && a.performanceStatus !== "needs_support")
        return 1;
      return b.riskStudentCount - a.riskStudentCount;
    });
  }, [cas, query, filter]);

  return (
    <>
      <TopBar
        title="CA管理"
        description="チームの稼働・リスク・フォロー品質を把握"
      />
      <div className="min-h-0 flex-1 overflow-y-auto scroll-area bg-[#f3f4f6]">
        <div className="mx-auto max-w-6xl space-y-6 p-5 sm:p-6">
          <CASummaryStrip cas={cas} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <input
                type="search"
                placeholder="CA名で検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    filter === f.key
                      ? "bg-foreground text-white"
                      : "bg-white text-foreground-secondary ring-1 ring-border hover:bg-background-subtle"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-foreground-muted">
              該当するCAがいません
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((ca) => (
                <CACard key={ca.id} ca={ca} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
