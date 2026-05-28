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
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">{ca.name}</h3>
            <p className="text-sm text-foreground-muted">{ca.role}</p>
          </div>
          <span className="rounded-full bg-background-subtle px-2.5 py-0.5 text-[11px] font-medium text-foreground-secondary">
            {PERFORMANCE_LABELS[ca.performanceStatus]}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-foreground-secondary">
          <span>担当学生</span>
          <span className="text-right font-medium tabular-nums">{ca.studentCount}</span>
          <span>離脱リスク</span>
          <span className="text-right font-medium tabular-nums text-danger">
            {ca.riskStudentCount}
          </span>
          <span>今週面談</span>
          <span className="text-right font-medium tabular-nums">
            {ca.weeklyInterviewCount}
          </span>
          <span>記録更新率</span>
          <span className="text-right font-medium tabular-nums">
            {ca.memoUpdateRate ?? "—"}%
          </span>
          <span>未対応学生</span>
          <span className="text-right font-medium tabular-nums">
            {ca.unresponsiveCount ?? 0}
          </span>
          <span>選考中</span>
          <span className="text-right font-medium tabular-nums">
            {ca.selectingCount ?? 0}
          </span>
          <span>内定</span>
          <span className="text-right font-medium tabular-nums">
            {ca.offerCount ?? 0}
          </span>
          <span>最終活動</span>
          <span className="text-right text-xs text-foreground-muted">
            {new Date(ca.lastActivityAt).toLocaleDateString("ja-JP")}
          </span>
        </div>
        {ca.aiComment && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-foreground-secondary">
            {ca.aiComment}
          </p>
        )}
      </Card>
    </Link>
  );
}
