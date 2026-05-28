import { cn } from "@/lib/utils/cn";
import type { AlertSeverity } from "@/lib/data/types";

interface SeverityBannerProps {
  severity: AlertSeverity;
  title: string;
  description?: string;
  className?: string;
}

export function SeverityBanner({
  severity,
  title,
  description,
  className,
}: SeverityBannerProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-l-[3px] bg-background-subtle px-3 py-2.5",
        severity === "critical" && "border-l-danger",
        severity === "warning" && "border-l-warning",
        severity === "info" && "border-l-accent",
        className
      )}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>
      )}
    </div>
  );
}
