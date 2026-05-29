import Link from "next/link";
import type { CAAttentionSummary } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {sorted.slice(0, 4).map((summary) => {
        const urgent =
          summary.ca.performanceStatus === "needs_support" ||
          summary.delayedReplyCount >= 2;

        return (
          <Link
            key={summary.ca.id}
            href={`/cas/${summary.ca.id}`}
            className={cn(
              "executive-panel block p-4 transition-shadow hover:shadow-md",
              urgent && "ring-1 ring-warning/40"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-foreground">{summary.ca.name}</p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  urgent
                    ? "bg-warning-subtle text-warning"
                    : "bg-success-subtle text-success"
                )}
              >
                {PERFORMANCE_LABELS[summary.ca.performanceStatus]}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <dd className="text-base font-semibold tabular-nums">
                  {summary.delayedReplyCount}
                </dd>
                <dt className="text-[10px] text-foreground-muted">遅延</dt>
              </div>
              <div>
                <dd className="text-base font-semibold tabular-nums">
                  {summary.atRiskCount}
                </dd>
                <dt className="text-[10px] text-foreground-muted">離脱</dt>
              </div>
              <div>
                <dd className="text-base font-semibold tabular-nums">
                  {summary.interviewUpdateRate}%
                </dd>
                <dt className="text-[10px] text-foreground-muted">更新率</dt>
              </div>
            </dl>
          </Link>
        );
      })}
    </div>
  );
}
