import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { CAUser, CAPerformanceMetrics } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const statusConfig = {
  excellent: {
    badge: "bg-success-subtle text-success ring-success/30",
    avatar: "from-emerald-500 to-teal-600",
    bar: "bg-success",
  },
  good: {
    badge: "bg-accent-subtle text-accent ring-accent/30",
    avatar: "from-sky-500 to-indigo-600",
    bar: "bg-accent",
  },
  needs_support: {
    badge: "bg-warning-subtle text-warning ring-warning/30",
    avatar: "from-amber-500 to-orange-600",
    bar: "bg-warning",
  },
} as const;

export function CADetailHeader({
  ca,
  performance,
}: {
  ca: CAUser;
  performance: CAPerformanceMetrics;
}) {
  const config = statusConfig[ca.performanceStatus];

  const metrics = [
    { label: "担当学生", value: performance.studentCount, unit: "名" },
    { label: "離脱リスク", value: performance.atRiskCount, unit: "名", hot: performance.atRiskCount > 0 },
    { label: "今週面談", value: performance.weeklyInterviewCount, unit: "件" },
    { label: "更新率", value: performance.memoUpdateRate, unit: "%" },
    { label: "未対応", value: performance.unresponsiveCount, unit: "件", hot: performance.unresponsiveCount > 0 },
    { label: "内定", value: performance.offerCount, unit: "件", positive: true },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-card">
      <div className={cn("h-1.5", config.bar)} aria-hidden />
      <div className="p-5 sm:p-6">
        <Link
          href="/cas"
          className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-foreground-muted hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          CA一覧に戻る
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-bold text-white shadow-md",
                config.avatar
              )}
            >
              {ca.name.slice(0, 1)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{ca.name}</h1>
              <p className="text-sm text-foreground-muted">{ca.role}</p>
              <span
                className={cn(
                  "mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ring-1",
                  config.badge
                )}
              >
                {PERFORMANCE_LABELS[ca.performanceStatus]}
              </span>
            </div>
          </div>
          {performance.aiComment && (
            <div className="flex max-w-md gap-2 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-3 ring-1 ring-violet-100">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
              <p className="text-sm leading-relaxed text-foreground-secondary">
                {performance.aiComment}
              </p>
            </div>
          )}
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.map((m) => (
            <div
              key={m.label}
              className={cn(
                "rounded-xl border px-3 py-3 text-center",
                m.hot
                  ? "border-danger/25 bg-danger-subtle/50"
                  : m.positive
                    ? "border-success/25 bg-success-subtle/50"
                    : "border-border-subtle bg-background-subtle/60"
              )}
            >
              <dd
                className={cn(
                  "text-xl font-bold tabular-nums",
                  m.hot && "text-danger",
                  m.positive && "text-success"
                )}
              >
                {m.value}
                <span className="text-sm font-medium text-foreground-muted">
                  {m.unit}
                </span>
              </dd>
              <dt className="mt-1 text-[10px] font-medium text-foreground-muted">
                {m.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
