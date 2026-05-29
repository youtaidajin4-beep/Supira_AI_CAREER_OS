import Link from "next/link";
import { Users } from "lucide-react";
import type { CAAttentionSummary } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const avatarGradients = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
];

const statusConfig = {
  needs_support: {
    badge: "bg-warning-subtle text-warning ring-warning/30",
    bar: "bg-warning",
  },
  good: {
    badge: "bg-accent-subtle text-accent ring-accent/30",
    bar: "bg-accent",
  },
  excellent: {
    badge: "bg-success-subtle text-success ring-success/30",
    bar: "bg-success",
  },
};

export function ExecutiveCAStrip({
  summaries,
}: {
  summaries: CAAttentionSummary[];
}) {
  const sorted = [...summaries].sort((a, b) => {
    const score = (s: CAAttentionSummary) =>
      (s.ca.performanceStatus === "needs_support" ? 10 : 0) +
      s.delayedReplyCount * 2;
    return score(b) - score(a);
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sorted.slice(0, 4).map((summary, i) => {
        const urgent =
          summary.ca.performanceStatus === "needs_support" ||
          summary.delayedReplyCount >= 2;
        const status = statusConfig[summary.ca.performanceStatus];

        return (
          <Link
            key={summary.ca.id}
            href={`/cas/${summary.ca.id}`}
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
              urgent ? "border-warning/40 ring-2 ring-warning/20" : "border-border"
            )}
          >
            <div
              className={cn("absolute inset-x-0 top-0 h-1", status.bar)}
              aria-hidden
            />
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm",
                  avatarGradients[i % avatarGradients.length]
                )}
              >
                {summary.ca.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground group-hover:text-accent">
                  {summary.ca.name}
                </p>
                <span
                  className={cn(
                    "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
                    status.badge
                  )}
                >
                  {PERFORMANCE_LABELS[summary.ca.performanceStatus]}
                </span>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "返信遅延", value: summary.delayedReplyCount, hot: summary.delayedReplyCount > 0 },
                { label: "離脱", value: summary.atRiskCount, hot: summary.atRiskCount > 0 },
                { label: "更新率", value: `${summary.interviewUpdateRate}%`, hot: false },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-lg bg-background-subtle/80 px-2 py-2 text-center"
                >
                  <dd
                    className={cn(
                      "text-base font-bold tabular-nums",
                      m.hot ? "text-danger" : "text-foreground"
                    )}
                  >
                    {m.value}
                  </dd>
                  <dt className="text-[9px] text-foreground-muted">{m.label}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-3 flex items-center gap-1 text-[10px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
              <Users className="h-3 w-3" />
              詳細を見る
            </p>
          </Link>
        );
      })}
    </div>
  );
}
