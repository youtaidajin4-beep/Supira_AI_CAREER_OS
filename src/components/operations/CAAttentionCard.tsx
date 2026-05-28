import Link from "next/link";
import type { CAAttentionSummary } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

export function CAAttentionCard({ summary }: { summary: CAAttentionSummary }) {
  const needsAttention =
    summary.ca.performanceStatus === "needs_support" ||
    summary.delayedReplyCount >= 2 ||
    summary.interviewUpdateRate < 60;

  return (
    <Link
      href={`/cas/${summary.ca.id}`}
      className={cn(
        "block rounded-lg border border-border/70 px-3 py-2.5 hover:bg-background-subtle/80",
        needsAttention && "border-l-2 border-l-warning/80"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-foreground">{summary.ca.name}</span>
        {needsAttention && (
          <span className="text-[10px] text-warning">要フォロー</span>
        )}
      </div>
      <p className="mt-1 text-xs text-foreground-muted">
        担当{summary.studentCount} · 離脱{summary.atRiskCount} · 遅延
        {summary.delayedReplyCount} · 更新率{summary.interviewUpdateRate}%
      </p>
      <p className="mt-1.5 line-clamp-2 text-xs text-foreground-secondary">
        {summary.aiComment}
      </p>
    </Link>
  );
}
