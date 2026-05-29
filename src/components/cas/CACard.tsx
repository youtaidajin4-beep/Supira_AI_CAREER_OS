import Link from "next/link";
import type { CAUser } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const statusStyles = {
  excellent: "bg-success",
  good: "bg-accent",
  needs_support: "bg-warning",
} as const;

export function CACard({ ca }: { ca: CAUser }) {
  const urgent = ca.performanceStatus === "needs_support";

  return (
    <Link
      href={`/cas/${ca.id}`}
      className={cn(
        "executive-panel group block p-5 transition-all hover:shadow-md",
        urgent && "ring-1 ring-warning/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1f3f5] text-sm font-semibold text-foreground-secondary">
          {ca.name.slice(0, 1)}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
              statusStyles[ca.performanceStatus]
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-accent">
                {ca.name}
              </h3>
              <p className="text-xs text-foreground-muted">{ca.role}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                urgent
                  ? "bg-warning-subtle text-warning"
                  : "bg-background-subtle text-foreground-muted"
              )}
            >
              {PERFORMANCE_LABELS[ca.performanceStatus]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-border-subtle pt-4">
        {[
          { label: "担当", value: ca.studentCount },
          { label: "離脱", value: ca.riskStudentCount, alert: ca.riskStudentCount > 0 },
          { label: "遅延", value: ca.unresponsiveCount ?? 0, alert: (ca.unresponsiveCount ?? 0) > 0 },
          { label: "更新率", value: `${ca.memoUpdateRate ?? 0}%` },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <p
              className={cn(
                "text-lg font-semibold tabular-nums leading-none",
                m.alert && "text-danger"
              )}
            >
              {m.value}
            </p>
            <p className="mt-1 text-[10px] text-foreground-muted">{m.label}</p>
          </div>
        ))}
      </div>

      {ca.aiComment && (
        <p className="mt-3 line-clamp-2 rounded-lg bg-background-subtle/80 px-3 py-2 text-xs leading-relaxed text-foreground-secondary">
          {ca.aiComment}
        </p>
      )}
    </Link>
  );
}
