import { AlertCircle, AlertTriangle, Bell, Info } from "lucide-react";
import type { Alert, AlertSeverity } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const chips: {
  key: AlertSeverity | "all";
  label: string;
  icon: typeof Bell;
  activeClass: string;
}[] = [
  {
    key: "all",
    label: "すべて",
    icon: Bell,
    activeClass: "bg-foreground text-background ring-foreground",
  },
  {
    key: "critical",
    label: "緊急",
    icon: AlertCircle,
    activeClass: "bg-danger-subtle text-danger ring-danger/30",
  },
  {
    key: "warning",
    label: "要注意",
    icon: AlertTriangle,
    activeClass: "bg-warning-subtle text-warning ring-warning/30",
  },
  {
    key: "info",
    label: "情報",
    icon: Info,
    activeClass: "bg-accent-subtle text-accent ring-accent/30",
  },
];

export function AlertsSummaryBar({
  alerts,
  activeSeverity,
  onSeverityChange,
}: {
  alerts: Alert[];
  activeSeverity: string;
  onSeverityChange: (value: string) => void;
}) {
  const counts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
    info: alerts.filter((a) => a.severity === "info").length,
  };

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(({ key, label, icon: Icon, activeClass }) => {
        const active = activeSeverity === key || (key === "all" && !activeSeverity);
        const count = counts[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSeverityChange(key === "all" ? "" : key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition-all",
              active
                ? activeClass
                : "bg-background text-foreground-secondary ring-border hover:bg-background-subtle"
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={active ? 2 : 1.75} />
            {label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                active ? "bg-black/10" : "bg-background-subtle"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
