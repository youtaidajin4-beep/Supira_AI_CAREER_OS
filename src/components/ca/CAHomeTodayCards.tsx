import Link from "next/link";
import { Calendar, AlertCircle, ListTodo, Flame } from "lucide-react";
import type { CAHomeTodayStats } from "@/lib/ca/home-stats";

const cards = [
  {
    key: "todayInterviews" as const,
    label: "今日の面談",
    icon: Calendar,
    href: "/ca/interviews",
    accent: "text-accent",
    bg: "bg-accent-subtle/50",
  },
  {
    key: "needsFollowUp" as const,
    label: "要フォロー",
    icon: AlertCircle,
    href: "/ca/students",
    accent: "text-warning",
    bg: "bg-warning-subtle/60",
  },
  {
    key: "missingNextAction" as const,
    label: "次回アクション未設定",
    icon: ListTodo,
    href: "/ca/actions",
    accent: "text-foreground-secondary",
    bg: "bg-background-subtle",
  },
  {
    key: "atRiskCount" as const,
    label: "離脱リスク",
    icon: Flame,
    href: "/ca/students?filter=at_risk",
    accent: "text-danger",
    bg: "bg-danger-subtle/60",
  },
];

export function CAHomeTodayCards({ stats }: { stats: CAHomeTodayStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, href, accent, bg }) => (
        <Link
          key={key}
          href={href}
          className="rounded-xl border border-border/80 bg-white p-4 shadow-xs transition-shadow hover:shadow-sm"
        >
          <div className={`mb-3 inline-flex rounded-lg p-2 ${bg}`}>
            <Icon className={`h-4 w-4 ${accent}`} strokeWidth={1.75} />
          </div>
          <p className="text-[11px] font-medium text-foreground-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {stats[key]}
            <span className="ml-1 text-sm font-normal text-foreground-muted">件</span>
          </p>
        </Link>
      ))}
    </div>
  );
}
