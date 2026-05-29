import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ExecutiveSectionHeader({
  icon: Icon,
  title,
  description,
  href,
  linkLabel = "すべて見る →",
  accent = "accent",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  accent?: "accent" | "warning" | "danger" | "success";
}) {
  const accentMap = {
    accent: "bg-accent text-white",
    warning: "bg-warning text-white",
    danger: "bg-danger text-white",
    success: "bg-success text-white",
  };

  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm",
            accentMap[accent]
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>
          )}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-xs font-medium text-accent hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
