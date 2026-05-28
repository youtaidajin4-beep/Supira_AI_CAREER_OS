import { cn } from "@/lib/utils/cn";

interface StatItem {
  label: string;
  value: number;
  tone?: "default" | "warning" | "danger" | "accent";
}

export function DashboardQuickStats({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "rounded-xl border px-4 py-3.5 transition-colors",
            "border-border/80 bg-background shadow-[var(--shadow-xs)]",
            item.tone === "danger" &&
              item.value > 0 &&
              "border-danger/20 bg-danger-subtle/30",
            item.tone === "warning" &&
              item.value > 0 &&
              "border-warning/25 bg-warning-subtle/40",
            item.tone === "accent" && "border-accent/15 bg-accent-subtle/50"
          )}
        >
          <p
            className={cn(
              "text-2xl font-semibold tabular-nums tracking-tight",
              item.tone === "danger" && item.value > 0 && "text-danger",
              item.tone === "warning" && item.value > 0 && "text-warning",
              item.tone === "accent" && "text-accent"
            )}
          >
            {item.value}
          </p>
          <p className="mt-1 text-[11px] font-medium text-foreground-muted">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
