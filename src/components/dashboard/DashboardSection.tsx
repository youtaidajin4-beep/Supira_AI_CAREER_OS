import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  badge?: string | number;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  variant?: "elevated" | "flat";
}

export function DashboardSection({
  title,
  subtitle,
  href,
  hrefLabel = "すべて見る",
  badge,
  children,
  className,
  bodyClassName,
  variant = "elevated",
}: DashboardSectionProps) {
  return (
    <section
      className={cn(
        variant === "elevated" ? "dashboard-card" : "dashboard-card-muted",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border-subtle px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {badge !== undefined && (
              <span className="rounded-full bg-background-subtle px-2 py-0.5 text-[11px] font-medium tabular-nums text-foreground-muted">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs leading-relaxed text-foreground-muted">
              {subtitle}
            </p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-accent hover:text-accent-hover"
          >
            {hrefLabel}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className={cn("px-5 py-4 sm:px-6 sm:py-5", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}
