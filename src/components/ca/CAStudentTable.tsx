"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Student } from "@/lib/data/types";
import { STATUS_LABELS } from "@/lib/data/types";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { formatLastContact } from "@/lib/operations/recommended-actions";

export function CAStudentTable({ students }: { students: Student[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.university.toLowerCase().includes(q)
    );
  }, [students, query]);

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="名前・大学で検索"
          className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto scroll-x-smooth">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-background-subtle/80 text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
              <tr>
                <th className="px-4 py-2.5">名前</th>
                <th className="hidden px-4 py-2.5 sm:table-cell">大学</th>
                <th className="px-4 py-2.5">ステータス</th>
                <th className="px-4 py-2.5">温度感</th>
                <th className="hidden px-4 py-2.5 md:table-cell">最終接触</th>
                <th className="px-4 py-2.5">次回アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-white">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-background-subtle/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/ca/students/${s.id}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-foreground-muted sm:table-cell">
                    {s.university}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-secondary">
                    {STATUS_LABELS[s.status]}
                  </td>
                  <td className="px-4 py-3">
                    <TemperatureBadge temperature={s.temperature} />
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-foreground-muted md:table-cell">
                    {formatLastContact(s)}
                  </td>
                  <td className="max-w-[140px] truncate px-4 py-3 text-xs text-foreground-secondary">
                    {s.nextAction || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-foreground-muted">
            該当する学生がいません
          </p>
        )}
      </div>
    </div>
  );
}
