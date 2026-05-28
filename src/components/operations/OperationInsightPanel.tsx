import type { OperationInsight } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { cn } from "@/lib/utils/cn";

export function OperationInsightPanel({
  insights,
}: {
  insights: OperationInsight[];
}) {
  if (insights.length === 0) return null;

  return (
    <DashboardSection
      title="AIオペレーション提案"
      subtitle="経営判断のヒント"
      badge={insights.length}
      bodyClassName="!py-4"
    >
      <ul className="space-y-2">
        {insights.slice(0, 4).map((insight) => (
          <li
            key={insight.id}
            className={cn(
              "rounded-xl px-3 py-2.5",
              insight.severity === "warning" &&
                "border-l-[3px] border-l-warning/80 bg-warning-subtle/25",
              insight.severity === "critical" &&
                "border-l-[3px] border-l-danger/80 bg-danger-subtle/20",
              insight.severity === "info" && "bg-background-subtle/80"
            )}
          >
            <p className="text-[10px] font-medium text-foreground-muted">
              {insight.category}
            </p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-foreground-secondary">
              {insight.message}
            </p>
          </li>
        ))}
      </ul>
    </DashboardSection>
  );
}
