"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Student } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/api/fetch-json";
import { safeJson } from "@/lib/utils/safe-json";
import Link from "next/link";

export function CAActionsList({ students }: { students: Student[] }) {
  const [items, setItems] = useState(
    students.filter((s) => s.nextAction?.trim() && s.nextActionStatus !== "done")
  );

  const markDone = async (student: Student) => {
    const res = await fetch(`/api/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextActionStatus: "done" }),
    });
    const updated = await safeJson<Student>(res);
    if (updated?.id) {
      setItems((list) => list.filter((s) => s.id !== student.id));
    }
  };

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-foreground-muted">
        未完了の次回アクションはありません
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((s) => (
        <li
          key={s.id}
          className="flex items-start justify-between gap-3 rounded-xl border border-border bg-white p-4 shadow-xs"
        >
          <div className="min-w-0">
            <Link
              href={`/ca/students/${s.id}`}
              className="font-medium text-foreground hover:text-accent"
            >
              {s.name}
            </Link>
            <p className="mt-1 text-sm text-foreground-secondary">{s.nextAction}</p>
            {s.nextActionDue && (
              <p className="mt-1 text-xs text-foreground-muted">
                期限:{" "}
                {new Date(s.nextActionDue).toLocaleDateString("ja-JP", {
                  month: "numeric",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void markDone(s)}
          >
            <Check className="h-3.5 w-3.5" />
            完了
          </Button>
        </li>
      ))}
    </ul>
  );
}
