import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CAUser, CAPerformanceMetrics } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

export function CADetailHeader({
  ca,
  performance,
}: {
  ca: CAUser;
  performance: CAPerformanceMetrics;
}) {
  const urgent = ca.performanceStatus === "needs_support";

  return (
    <div className="executive-panel p-5 sm:p-6">
      <Link
        href="/cas"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-foreground-muted hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        CA一覧
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f3f5] text-xl font-semibold text-foreground">
            {ca.name.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{ca.name}</h1>
            <p className="text-sm text-foreground-muted">{ca.role}</p>
            <span
              className={cn(
                "mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                urgent
                  ? "bg-warning-subtle text-warning"
                  : "bg-success-subtle text-success"
              )}
            >
              {PERFORMANCE_LABELS[ca.performanceStatus]}
            </span>
          </div>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-foreground-secondary">
          {performance.aiComment}
        </p>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["担当", performance.studentCount],
          ["離脱リスク", performance.atRiskCount],
          ["今週面談", performance.weeklyInterviewCount],
          ["更新率", `${performance.memoUpdateRate}%`],
          ["未対応", performance.unresponsiveCount],
          ["内定", performance.offerCount],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-lg bg-background-subtle/80 px-3 py-2.5 text-center"
          >
            <dd className="text-lg font-semibold tabular-nums text-foreground">
              {value}
            </dd>
            <dt className="mt-0.5 text-[10px] text-foreground-muted">{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
