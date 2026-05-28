import { Card } from "@/components/ui/card";
import type { ExecutiveDashboardStats } from "@/lib/data/types";

interface ExecutiveStatGridProps {
  stats: ExecutiveDashboardStats;
}

const items = [
  { key: "totalStudents", label: "総学生数" },
  { key: "totalCAs", label: "CA数" },
  { key: "atRiskCount", label: "離脱リスク" },
  { key: "weeklyInterviews", label: "今週面談" },
  { key: "unresponsiveCount", label: "未対応（7日+）" },
  { key: "selectingCount", label: "選考中" },
  { key: "offerCount", label: "内定・承諾" },
] as const;

export function ExecutiveStatGrid({ stats }: ExecutiveStatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
      {items.map(({ key, label }) => (
        <Card key={key} className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-foreground-muted">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {stats[key]}
          </p>
        </Card>
      ))}
    </div>
  );
}
