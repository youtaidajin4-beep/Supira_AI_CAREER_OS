import { cn } from "@/lib/utils/cn";
import type { Temperature } from "@/lib/data/types";
import { TEMPERATURE_LABELS } from "@/lib/data/types";

const styles: Record<
  Temperature,
  { badge: string; dot: string }
> = {
  high: {
    badge: "bg-accent-subtle text-accent ring-1 ring-accent/15",
    dot: "bg-accent",
  },
  medium: {
    badge: "bg-background-subtle text-foreground-secondary ring-1 ring-border",
    dot: "bg-foreground-muted",
  },
  low: {
    badge: "bg-background-subtle text-foreground-muted ring-1 ring-border",
    dot: "bg-border",
  },
  at_risk: {
    badge: "bg-danger-subtle text-danger ring-1 ring-danger/15",
    dot: "bg-danger",
  },
};

interface TemperatureBadgeProps {
  temperature: Temperature;
  className?: string;
  showDot?: boolean;
}

export function TemperatureBadge({
  temperature,
  className,
  showDot = true,
}: TemperatureBadgeProps) {
  const s = styles[temperature];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        s.badge,
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />
      )}
      {TEMPERATURE_LABELS[temperature]}
    </span>
  );
}
