import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { CAUser } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

export function CAOverviewGrid({ cas }: { cas: CAUser[] }) {
  const sorted = [...cas].sort(
    (a, b) => b.riskStudentCount - a.riskStudentCount
  );

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">CA概要</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((ca) => (
          <Link
            key={ca.id}
            href={`/cas/${ca.id}`}
            className={cn(
              "rounded-lg border border-border p-3 transition-colors hover:bg-background-subtle",
              ca.riskStudentCount > 0 && "border-l-[3px] border-l-warning"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">{ca.name}</p>
                <p className="text-xs text-foreground-muted">{ca.role}</p>
              </div>
              <span className="text-[11px] text-foreground-muted">
                {PERFORMANCE_LABELS[ca.performanceStatus]}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-foreground-secondary">
              <span>担当 {ca.studentCount}名</span>
              <span>リスク {ca.riskStudentCount}名</span>
              <span>今週面談 {ca.weeklyInterviewCount}</span>
              <span>アラート {ca.openAlertCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
