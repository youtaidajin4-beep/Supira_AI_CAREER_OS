import { Lightbulb } from "lucide-react";
import type { OperationInsight } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

export function OperationInsightPanel({
  insights,
}: {
  insights: OperationInsight[];
}) {
  if (insights.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-foreground-muted" strokeWidth={1.75} />
        <h3 className="text-base font-semibold text-foreground">
          AIオペレーション提案
        </h3>
        <span className="text-xs text-foreground-muted">経営判断向け</span>
      </div>
      <ul className="space-y-3">
        {insights.map((insight) => (
          <li
            key={insight.id}
            className={cn(
              "rounded-lg border border-border-subtle px-4 py-3",
              insight.severity === "warning" &&
                "border-l-[3px] border-l-warning bg-warning-subtle/20",
              insight.severity === "critical" &&
                "border-l-[3px] border-l-danger bg-danger-subtle/20"
            )}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
              {insight.category}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
              {insight.message}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
