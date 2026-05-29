import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Clock,
  Sparkles,
  UserMinus,
  Users,
} from "lucide-react";
import type { CAUser } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const statusConfig = {
  excellent: {
    bar: "bg-success",
    badge: "bg-success-subtle text-success ring-success/25",
    avatar: "from-emerald-500 to-teal-600",
    label: "好調 — 高い成果が出ています",
  },
  good: {
    bar: "bg-accent",
    badge: "bg-accent-subtle text-accent ring-accent/25",
    avatar: "from-sky-500 to-indigo-600",
    label: "安定 — 通常どおり運用中",
  },
  needs_support: {
    bar: "bg-warning",
    badge: "bg-warning-subtle text-warning ring-warning/30",
    avatar: "from-amber-500 to-orange-600",
    label: "要支援 — 代表フォローを推奨",
  },
} as const;

export function CACard({ ca }: { ca: CAUser }) {
  const config = statusConfig[ca.performanceStatus];
  const urgent = ca.performanceStatus === "needs_support";

  const metrics = [
    {
      icon: Users,
      label: "担当学生",
      value: `${ca.studentCount}名`,
      hint: "現在の担当数",
      alert: false,
    },
    {
      icon: UserMinus,
      label: "離脱リスク",
      value: `${ca.riskStudentCount}名`,
      hint: "要注意の学生",
      alert: ca.riskStudentCount > 0,
    },
    {
      icon: Clock,
      label: "返信遅延",
      value: `${ca.unresponsiveCount ?? 0}件`,
      hint: "未対応の連絡",
      alert: (ca.unresponsiveCount ?? 0) > 0,
    },
    {
      icon: ClipboardList,
      label: "メモ更新率",
      value: `${ca.memoUpdateRate ?? 0}%`,
      hint: "面談記録の鮮度",
      alert: (ca.memoUpdateRate ?? 0) < 60,
    },
  ];

  return (
    <Link
      href={`/cas/${ca.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl border bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
        urgent ? "border-warning/50 ring-2 ring-warning/15" : "border-border"
      )}
    >
      <div className={cn("h-1.5 w-full", config.bar)} aria-hidden />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-md",
              config.avatar
            )}
          >
            {ca.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground group-hover:text-accent">
                {ca.name}
              </h3>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1",
                  config.badge
                )}
              >
                {PERFORMANCE_LABELS[ca.performanceStatus]}
              </span>
            </div>
            <p className="text-xs text-foreground-muted">{ca.role}</p>
            <p className="mt-1.5 text-[11px] font-medium text-foreground-secondary">
              {config.label}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className={cn(
                  "rounded-lg border px-3 py-2.5",
                  m.alert
                    ? "border-danger/20 bg-danger-subtle/40"
                    : "border-border-subtle bg-background-subtle/50"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5",
                      m.alert ? "text-danger" : "text-foreground-muted"
                    )}
                  />
                  <span className="text-[10px] font-medium text-foreground-muted">
                    {m.label}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-1 text-lg font-bold tabular-nums leading-none",
                    m.alert ? "text-danger" : "text-foreground"
                  )}
                >
                  {m.value}
                </p>
                <p className="mt-0.5 text-[9px] text-foreground-muted">{m.hint}</p>
              </div>
            );
          })}
        </div>

        {ca.aiComment && (
          <div className="mt-3 flex gap-2 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 px-3 py-2.5 ring-1 ring-violet-100">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
            <p className="line-clamp-2 text-xs leading-relaxed text-foreground-secondary">
              {ca.aiComment}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
