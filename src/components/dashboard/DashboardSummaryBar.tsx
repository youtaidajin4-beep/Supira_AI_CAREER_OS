import { cn } from "@/lib/utils/cn";

interface SummaryItem {
  label: string;
  value: number;
  highlight?: boolean;
}

export function DashboardSummaryBar({
  dateLabel,
  items,
}: {
  dateLabel: string;
  items: SummaryItem[];
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-foreground-muted">{dateLabel}</p>
      <dl className="flex flex-wrap gap-x-5 gap-y-1 sm:gap-x-8">
        {items.map((item) => (
          <div key={item.label} className="flex items-baseline gap-1.5">
            <dt className="text-xs text-foreground-muted">{item.label}</dt>
            <dd
              className={cn(
                "text-sm font-semibold tabular-nums",
                item.highlight ? "text-accent" : "text-foreground"
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
