"use client";

import { useEffect, useState } from "react";
import type { TimelineEvent } from "@/lib/data/types";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import { cn } from "@/lib/utils/cn";

const TYPE_LABELS: Record<TimelineEvent["type"], string> = {
  interview: "面談",
  memo: "メモ",
  contact: "連絡",
  temperature: "温度感",
  selection: "選考",
  follow: "フォロー",
  status: "ステータス",
};

function groupByDate(events: TimelineEvent[]) {
  const groups = new Map<string, TimelineEvent[]>();
  for (const e of events) {
    const key = new Date(e.occurredAt).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }
  return groups;
}

export function StudentTimeline({ studentId }: { studentId: string }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const data = await fetchJson<TimelineEvent[]>(
        `/api/students/${studentId}/timeline`,
        { fallback: () => clientMockFallback.studentTimeline(studentId) }
      );
      setEvents(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, [studentId]);

  if (loading) {
    return (
      <p className="p-6 text-sm text-foreground-muted">タイムラインを読み込み中...</p>
    );
  }

  if (events.length === 0) {
    return (
      <p className="p-6 text-sm text-foreground-muted">
        まだタイムラインイベントがありません
      </p>
    );
  }

  const groups = groupByDate(events);

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 lg:p-8">
      {Array.from(groups.entries()).map(([date, dayEvents]) => (
        <div key={date}>
          <p className="mb-4 text-xs font-semibold text-foreground-muted">
            {date}
          </p>
          <ol className="relative space-y-0 border-l border-border pl-6">
            {dayEvents.map((event) => (
              <li key={event.id} className="relative pb-6 last:pb-0">
                <span
                  className={cn(
                    "absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                    event.severity === "critical"
                      ? "bg-danger"
                      : event.severity === "warning"
                        ? "bg-warning"
                        : "bg-accent"
                  )}
                />
                <div
                  className={cn(
                    "rounded-lg border border-border-subtle px-4 py-3",
                    event.severity === "warning" &&
                      "border-l-[3px] border-l-warning bg-warning-subtle/15"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase text-foreground-muted">
                      {TYPE_LABELS[event.type]}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {new Date(event.occurredAt).toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {event.title}
                  </p>
                  <p className="mt-0.5 text-xs text-foreground-secondary">
                    {event.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
