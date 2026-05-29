import { cn } from "@/lib/utils/cn";

export interface ExecutiveKpi {
  label: string;
  value: number;
  emphasis?: "primary" | "warning" | "danger";
}

export function ExecutiveKpiBar({
  dateLabel,
  kpis,
}: {
  dateLabel: string;
  kpis: ExecutiveKpi[];
}) {
  return (
    <div className="executive-panel flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
          今日のオペレーション
        </p>
        <p className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
          {dateLabel}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={cn(
              "rounded-full border px-4 py-2 text-center",
              kpi.emphasis === "primary" &&
                "border-accent/30 bg-accent-subtle",
              kpi.emphasis === "warning" &&
                kpi.value > 0 &&
                "border-warning/30 bg-warning-subtle",
              kpi.emphasis === "danger" &&
                kpi.value > 0 &&
                "border-danger/25 bg-danger-subtle",
              !kpi.emphasis && "border-border bg-white"
            )}
          >
            <p
              className={cn(
                "text-xl font-semibold tabular-nums leading-none",
                kpi.emphasis === "danger" && kpi.value > 0 && "text-danger",
                kpi.emphasis === "warning" && kpi.value > 0 && "text-warning",
                kpi.emphasis === "primary" && "text-accent"
              )}
            >
              {kpi.value}
            </p>
            <p className="mt-1 text-[10px] font-medium text-foreground-muted">
              {kpi.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
