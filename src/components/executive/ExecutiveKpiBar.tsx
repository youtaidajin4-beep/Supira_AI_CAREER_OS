import {
  AlertTriangle,
  Building2,
  Target,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ExecutiveKpi {
  label: string;
  value: number;
  emphasis?: "primary" | "warning" | "danger";
}

const kpiIcons: Record<string, LucideIcon> = {
  優先学生: Target,
  代表介入: UserCog,
  未共有: Building2,
  離脱リスク: AlertTriangle,
};

const kpiStyles = {
  primary: {
    card: "bg-white/15 ring-1 ring-white/25 backdrop-blur-sm",
    value: "text-white",
    label: "text-white/80",
    icon: "bg-white/20 text-white",
  },
  warning: {
    card: "bg-amber-400/20 ring-1 ring-amber-200/40 backdrop-blur-sm",
    value: "text-amber-50",
    label: "text-amber-100/90",
    icon: "bg-amber-300/30 text-amber-50",
  },
  danger: {
    card: "bg-red-400/20 ring-1 ring-red-200/40 backdrop-blur-sm",
    value: "text-red-50",
    label: "text-red-100/90",
    icon: "bg-red-300/30 text-red-50",
  },
  neutral: {
    card: "bg-white/10 ring-1 ring-white/20 backdrop-blur-sm",
    value: "text-white",
    label: "text-white/75",
    icon: "bg-white/15 text-white/90",
  },
};

export function ExecutiveKpiBar({
  dateLabel,
  kpis,
}: {
  dateLabel: string;
  kpis: ExecutiveKpi[];
}) {
  return (
    <div className="executive-hero relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 left-1/4 h-48 w-48 rounded-full bg-indigo-300/20 blur-2xl" />
      </div>
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
            代表司令塔 · Supira
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{dateLabel}</p>
          <p className="mt-2 max-w-sm text-sm text-white/75">
            今日の優先判断とチームの状態を、この画面で俯瞰できます。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:gap-3">
          {kpis.map((kpi) => {
            const Icon = kpiIcons[kpi.label] ?? Target;
            const hasAlert =
              (kpi.emphasis === "warning" || kpi.emphasis === "danger") &&
              kpi.value > 0;
            const styleKey = hasAlert
              ? kpi.emphasis === "danger"
                ? "danger"
                : "warning"
              : kpi.emphasis === "primary"
                ? "primary"
                : "neutral";
            const style = kpiStyles[styleKey];

            return (
              <div
                key={kpi.label}
                className={cn("rounded-xl px-3 py-3 sm:px-4", style.card)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg",
                      style.icon
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <p className={cn("text-2xl font-bold tabular-nums", style.value)}>
                    {kpi.value}
                  </p>
                </div>
                <p className={cn("mt-1 text-[10px] font-medium", style.label)}>
                  {kpi.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
