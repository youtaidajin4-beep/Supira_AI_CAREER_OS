import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DashboardSectionProps {
  title: string;
  href?: string;
  hrefLabel?: string;
  badge?: string | number;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function DashboardSection({
  title,
  href,
  hrefLabel = "すべて",
  badge,
  children,
  className,
  bodyClassName,
}: DashboardSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/70 bg-background",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {badge !== undefined && (
            <span className="text-xs tabular-nums text-foreground-muted">
              {badge}
            </span>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-0.5 text-xs text-foreground-muted hover:text-accent"
          >
            {hrefLabel}
            <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div
        className={cn(
          "border-t border-border-subtle px-4 py-3 sm:px-5 sm:py-4",
          bodyClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
