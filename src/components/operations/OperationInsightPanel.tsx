import type { OperationInsight } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export function OperationInsightPanel({
  insights,
}: {
  insights: OperationInsight[];
}) {
  if (insights.length === 0) return null;

  return (
    <DashboardSection title="AI提案" badge={insights.length}>
      <ul className="space-y-2">
        {insights.slice(0, 3).map((insight) => (
          <li key={insight.id} className="text-sm text-foreground-secondary">
            <span className="text-foreground-muted">{insight.category}: </span>
            {insight.message}
          </li>
        ))}
      </ul>
    </DashboardSection>
  );
}
