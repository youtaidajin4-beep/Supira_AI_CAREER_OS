import { cn } from "@/lib/utils/cn";

const styles = {
  high: "bg-danger-subtle text-danger ring-danger/20",
  medium: "bg-warning-subtle text-warning ring-warning/20",
  low: "bg-background-subtle text-foreground-muted ring-border/80",
};

const labels = { high: "高", medium: "中", low: "低" };

export function PriorityBadge({
  priority,
}: {
  priority: "high" | "medium" | "low";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1",
        styles[priority]
      )}
    >
      重要度 {labels[priority]}
    </span>
  );
}
