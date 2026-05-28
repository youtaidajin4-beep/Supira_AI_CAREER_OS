import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  Info,
  UserCog,
} from "lucide-react";
import type { Alert, AlertSeverity } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const severityConfig: Record<
  AlertSeverity,
  {
    label: string;
    icon: typeof AlertCircle;
    border: string;
    bg: string;
    badge: string;
    dot: string;
  }
> = {
  critical: {
    label: "緊急",
    icon: AlertCircle,
    border: "border-l-danger",
    bg: "bg-danger-subtle/40",
    badge: "bg-danger-subtle text-danger ring-danger/20",
    dot: "bg-danger",
  },
  warning: {
    label: "要注意",
    icon: AlertTriangle,
    border: "border-l-warning",
    bg: "bg-warning-subtle/50",
    badge: "bg-warning-subtle text-warning ring-warning/20",
    dot: "bg-warning",
  },
  info: {
    label: "情報",
    icon: Info,
    border: "border-l-accent",
    bg: "bg-accent-subtle/40",
    badge: "bg-accent-subtle text-accent ring-accent/20",
    dot: "bg-accent",
  },
};

export function AlertCard({
  alert,
  caName,
  studentName,
}: {
  alert: Alert;
  caName?: string;
  studentName?: string;
}) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <article
      className={cn(
        "rounded-xl border border-border border-l-[3px] p-4 shadow-xs transition-shadow hover:shadow-sm",
        config.border,
        config.bg
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1",
            config.badge
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1",
                config.badge
              )}
            >
              {config.label}
            </span>
            {caName && (
              <span className="inline-flex items-center gap-1 text-[11px] text-foreground-muted">
                <UserCog className="h-3 w-3" />
                {caName}
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
            {alert.title}
          </h3>
          {alert.description && (
            <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
              {alert.description}
            </p>
          )}
          {(studentName || alert.relatedStudentId || alert.relatedCaId) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {alert.relatedStudentId && (
                <Link
                  href={`/students/${alert.relatedStudentId}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-accent shadow-xs ring-1 ring-border transition-colors hover:bg-accent-subtle"
                >
                  {studentName ?? "学生"}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              )}
              {alert.relatedCaId && (
                <Link
                  href={`/cas/${alert.relatedCaId}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-foreground-secondary shadow-xs ring-1 ring-border transition-colors hover:bg-background-subtle"
                >
                  CA詳細
                  <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
