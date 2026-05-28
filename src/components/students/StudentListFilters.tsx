"use client";

import { Search } from "lucide-react";
import type { StudentStatus } from "@/lib/data/types";
import { STATUS_LABELS } from "@/lib/data/types";

interface StudentListFiltersProps {
  name: string;
  university: string;
  status: string;
  onNameChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function StudentListFilters({
  name,
  university,
  status,
  onNameChange,
  onUniversityChange,
  onStatusChange,
}: StudentListFiltersProps) {
  return (
    <div className="space-y-2 border-b border-border-subtle bg-background-subtle/50 p-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted"
          strokeWidth={2}
        />
        <input
          type="text"
          placeholder="名前で検索"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm shadow-xs transition-colors placeholder:text-foreground-muted/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <input
        type="text"
        placeholder="大学で検索"
        value={university}
        onChange={(e) => onUniversityChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-xs transition-colors placeholder:text-foreground-muted/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-xs transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        <option value="">すべてのステータス</option>
        {(Object.keys(STATUS_LABELS) as StudentStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
