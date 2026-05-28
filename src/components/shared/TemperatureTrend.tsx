import type { Temperature, TemperatureSnapshot } from "@/lib/data/types";
import { TEMPERATURE_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const TEMP_COLORS: Record<Temperature, string> = {
  high: "bg-success",
  medium: "bg-accent",
  low: "bg-warning",
  at_risk: "bg-danger",
};

export function TemperatureTrend({
  history,
  className,
}: {
  history: TemperatureSnapshot[];
  className?: string;
}) {
  const sorted = [...history].sort(
    (a, b) =>
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <p className={cn("text-xs text-foreground-muted", className)}>
        履歴データがありません
      </p>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-1">
        {sorted.map((snap, i) => (
          <div key={snap.recordedAt} className="flex items-center gap-1">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                TEMP_COLORS[snap.temperature]
              )}
              title={TEMPERATURE_LABELS[snap.temperature]}
            />
            {i < sorted.length - 1 && (
              <span className="h-px w-3 bg-border" aria-hidden />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-foreground-muted">
        <span>{TEMPERATURE_LABELS[sorted[0].temperature]}</span>
        <span>→</span>
        <span>
          {TEMPERATURE_LABELS[sorted[sorted.length - 1].temperature]}
        </span>
      </div>
    </div>
  );
}
