"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { CACard } from "@/components/cas/CACard";
import { CASummaryStrip } from "@/components/cas/CASummaryStrip";
import { CAStatusLegend } from "@/components/cas/CAStatusLegend";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { CAUser, CAPerformanceStatus } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

type FilterKey = "all" | CAPerformanceStatus;

const filters: {
  key: FilterKey;
  label: string;
  activeClass: string;
}[] = [
  { key: "all", label: "すべて", activeClass: "bg-foreground text-white" },
  {
    key: "needs_support",
    label: "要支援",
    activeClass: "bg-warning text-white",
  },
  { key: "good", label: "安定", activeClass: "bg-accent text-white" },
  { key: "excellent", label: "好調", activeClass: "bg-success text-white" },
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

  const needsSupportList = filtered.filter(
    (c) => c.performanceStatus === "needs_support"
  );
  const otherList = filtered.filter(
    (c) => c.performanceStatus !== "needs_support"
  );
  const showGrouped = filter === "all" && needsSupportList.length > 0;

  return (
    <>
      <TopBar
        title="CA管理"
        description="チームの稼働・リスク・フォロー品質をひと目で把握"
      />
      <div className="min-h-0 flex-1 overflow-y-auto scroll-area ca-page-bg">
        <div className="mx-auto max-w-6xl space-y-5 p-5 sm:p-6">
          <CASummaryStrip cas={cas} />
          <CAStatusLegend />

          <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <input
                type="search"
                placeholder="CA名で検索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background-subtle/50 pl-9 pr-3 text-sm focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                    filter === f.key
                      ? f.activeClass + " shadow-sm"
                      : "bg-background-subtle text-foreground-secondary ring-1 ring-border hover:bg-white"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white py-16 text-center">
              <p className="text-sm font-medium text-foreground-muted">
                該当するCAがいません
              </p>
            </div>
          ) : showGrouped ? (
            <div className="space-y-8">
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  <h2 className="text-sm font-semibold text-foreground">
                    要フォロー（{needsSupportList.length}名）
                  </h2>
                  <p className="text-xs text-foreground-muted">
                    優先的に確認してください
                  </p>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {needsSupportList.map((ca) => (
                    <CACard key={ca.id} ca={ca} />
                  ))}
                </div>
              </section>
              {otherList.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <h2 className="text-sm font-semibold text-foreground">
                      その他のCA（{otherList.length}名）
                    </h2>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {otherList.map((ca) => (
                      <CACard key={ca.id} ca={ca} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
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
