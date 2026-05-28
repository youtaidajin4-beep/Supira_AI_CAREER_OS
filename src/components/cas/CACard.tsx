import Link from "next/link";
import type { CAUser } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function CACard({ ca }: { ca: CAUser }) {
  return (
    <Link href={`/cas/${ca.id}`}>
      <Card
        className={cn(
          "p-5 transition-shadow hover:shadow-md",
          ca.riskStudentCount > 0 && "border-l-[3px] border-l-warning"
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{ca.name}</h3>
            <p className="text-sm text-foreground-muted">{ca.role}</p>
          </div>
          <span className="rounded-full bg-background-subtle px-2.5 py-0.5 text-[11px] font-medium text-foreground-secondary">
            {PERFORMANCE_LABELS[ca.performanceStatus]}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-foreground-secondary">
          <span>担当学生</span>
          <span className="text-right font-medium tabular-nums">{ca.studentCount}</span>
          <span>離脱リスク</span>
          <span className="text-right font-medium tabular-nums text-danger">
            {ca.riskStudentCount}
          </span>
          <span>温度感「高」</span>
          <span className="text-right font-medium tabular-nums">{ca.highTempCount}</span>
          <span>今週面談</span>
          <span className="text-right font-medium tabular-nums">
            {ca.weeklyInterviewCount}
          </span>
          <span>未対応アラート</span>
          <span className="text-right font-medium tabular-nums">{ca.openAlertCount}</span>
          <span>最終活動</span>
          <span className="text-right text-xs text-foreground-muted">
            {new Date(ca.lastActivityAt).toLocaleDateString("ja-JP")}
          </span>
        </div>
        {ca.memo && (
          <p className="mt-3 line-clamp-2 text-xs text-foreground-muted">{ca.memo}</p>
        )}
      </Card>
    </Link>
  );
}
