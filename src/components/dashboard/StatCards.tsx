import { Users, AlertTriangle, Calendar, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardsProps {
  totalStudents: number;
  atRiskCount: number;
  todayInterviews: number;
  recentCount: number;
}

const stats = [
  {
    key: "totalStudents" as const,
    label: "担当学生",
    sub: "登録済み",
    icon: Users,
    iconClass: "text-accent",
    iconBg: "bg-accent-subtle",
  },
  {
    key: "atRiskCount" as const,
    label: "離脱リスク",
    sub: "要フォロー",
    icon: AlertTriangle,
    iconClass: "text-danger",
    iconBg: "bg-danger-subtle",
    highlight: true,
  },
  {
    key: "todayInterviews" as const,
    label: "本日の面談",
    sub: "実施・予定",
    icon: Calendar,
    iconClass: "text-foreground-secondary",
    iconBg: "bg-background-subtle",
  },
  {
    key: "recentCount" as const,
    label: "最近の追加",
    sub: "直近5件",
    icon: UserPlus,
    iconClass: "text-foreground-secondary",
    iconBg: "bg-background-subtle",
  },
];

export function StatCards({
  totalStudents,
  atRiskCount,
  todayInterviews,
  recentCount,
}: StatCardsProps) {
  const values = {
    totalStudents,
    atRiskCount,
    todayInterviews,
    recentCount,
  };

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map(({ key, label, sub, icon: Icon, iconClass, iconBg, highlight }) => {
        const value = values[key];
        const isRisk = key === "atRiskCount" && value > 0;

        return (
          <div
            key={key}
            className={cn(
              "group rounded-xl border bg-background p-5 shadow-xs transition-shadow hover:shadow-sm",
              isRisk && highlight
                ? "border-danger/20"
                : "border-border"
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-foreground-muted">
                  {label}
                </p>
                <p className="text-[10px] text-foreground-muted/70">{sub}</p>
              </div>
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                  iconBg
                )}
              >
                <Icon className={cn("h-4 w-4", iconClass)} strokeWidth={1.75} />
              </div>
            </div>
            <p
              className={cn(
                "mt-4 tabular-nums text-3xl font-semibold tracking-tight",
                isRisk ? "text-danger" : "text-foreground"
              )}
            >
              {value}
              {key === "atRiskCount" && value > 0 && (
                <span className="ml-1.5 text-sm font-normal text-danger/80">
                  名
                </span>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
