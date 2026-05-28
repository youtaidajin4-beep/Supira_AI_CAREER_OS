import Link from "next/link";
import type { CAAttentionSummary } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const METRICS: {
  key: keyof Pick<
    CAAttentionSummary,
    | "studentCount"
    | "atRiskCount"
    | "staleInterviewCount"
    | "interviewUpdateRate"
    | "weeklyInterviewCount"
    | "delayedReplyCount"
    | "highTempCount"
  >;
  label: string;
  suffix?: string;
}[] = [
  { key: "studentCount", label: "担当数" },
  { key: "atRiskCount", label: "離脱リスク" },
  { key: "staleInterviewCount", label: "面談停滞" },
  { key: "interviewUpdateRate", label: "記録更新率", suffix: "%" },
  { key: "weeklyInterviewCount", label: "今週面談" },
  { key: "delayedReplyCount", label: "返信遅延" },
  { key: "highTempCount", label: "高温度感" },
];

export function CAAttentionCard({ summary }: { summary: CAAttentionSummary }) {
  const needsAttention =
    summary.ca.performanceStatus === "needs_support" ||
    summary.delayedReplyCount >= 2 ||
    summary.interviewUpdateRate < 60;

  return (
    <Link
      href={`/cas/${summary.ca.id}`}
      className={cn(
        "block rounded-xl border border-border bg-background p-4 transition-all hover:shadow-sm",
        needsAttention && "border-l-[3px] border-l-warning"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-foreground">{summary.ca.name}</p>
        {needsAttention && (
          <span className="text-[10px] font-medium text-warning">要フォロー</span>
        )}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {METRICS.map(({ key, label, suffix }) => (
          <div key={key} className="text-center">
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {summary[key]}
              {suffix ?? ""}
            </p>
            <p className="text-[10px] text-foreground-muted">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-foreground-secondary">
        {summary.aiComment}
      </p>
    </Link>
  );
}
