"use client";

import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { CACard } from "@/components/cas/CACard";
import { Input } from "@/components/ui/input";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { CAUser } from "@/lib/data/types";

type SortKey = "risk" | "students";

export default function CAListPage() {
  const [cas, setCas] = useState<CAUser[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("risk");

  useEffect(() => {
    void fetchJson<CAUser[]>("/api/cas", {
      fallback: () => clientMockFallback.cas(),
    }).then(setCas);
  }, []);

  const filtered = useMemo(() => {
    let list = cas.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "risk") {
      list = [...list].sort(
        (a, b) => b.riskStudentCount - a.riskStudentCount
      );
    } else {
      list = [...list].sort((a, b) => b.studentCount - a.studentCount);
    }
    return list;
  }, [cas, query, sort]);

  return (
    <>
      <TopBar title="CA一覧" description={`${cas.length}名`} />
      <div className="min-h-0 flex-1 overflow-y-auto scroll-area p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <Input
            placeholder="CA名で検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="risk">リスク数順</option>
            <option value="students">担当学生数順</option>
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((ca) => (
            <CACard key={ca.id} ca={ca} />
          ))}
        </div>
      </div>
    </>
  );
}
