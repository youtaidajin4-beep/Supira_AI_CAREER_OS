import { AlertTriangle, TrendingUp, Users, UserX } from "lucide-react";
import type { CAUser } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

export function CASummaryStrip({ cas }: { cas: CAUser[] }) {
  const needsSupport = cas.filter((c) => c.performanceStatus === "needs_support").length;
  const excellent = cas.filter((c) => c.performanceStatus === "excellent").length;
  const totalRisk = cas.reduce((s, c) => s + c.riskStudentCount, 0);

  const cards = [
    {
      label: "CA人数",
      sub: "チーム全体",
      value: cas.length,
      icon: Users,
      gradient: "from-indigo-500 to-violet-600",
      valueClass: "text-foreground",
    },
    {
      label: "要支援",
      sub: "早めにフォロー",
      value: needsSupport,
      icon: AlertTriangle,
      gradient: "from-amber-500 to-orange-500",
      valueClass: needsSupport > 0 ? "text-warning" : "text-foreground",
      highlight: needsSupport > 0,
    },
    {
      label: "好調",
      sub: "安定稼働中",
      value: excellent,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-600",
      valueClass: "text-success",
    },
    {
      label: "離脱リスク",
      sub: "担当学生の合計",
      value: totalRisk,
      icon: UserX,
      gradient: "from-rose-500 to-red-600",
      valueClass: totalRisk > 0 ? "text-danger" : "text-foreground",
      highlight: totalRisk > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={cn(
              "relative overflow-hidden rounded-xl border bg-white p-4 shadow-card",
              item.highlight && "ring-2 ring-warning/25"
            )}
          >
            <div
              className={cn(
                "absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-15 blur-xl",
                item.gradient
              )}
              aria-hidden
            />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-foreground-muted">
                  {item.sub}
                </p>
                <p
                  className={cn(
                    "mt-1 text-3xl font-bold tabular-nums leading-none",
                    item.valueClass
                  )}
                >
                  {item.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-foreground">
                  {item.label}
                </p>
              </div>
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                  item.gradient
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
