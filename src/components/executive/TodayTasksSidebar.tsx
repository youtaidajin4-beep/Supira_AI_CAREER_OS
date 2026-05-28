import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  ChevronRight,
} from "lucide-react";
import type { Alert, CompanyUpdate } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

export function TodayTasksSidebar({
  alerts,
  companyUpdates,
}: {
  alerts: Alert[];
  companyUpdates: CompanyUpdate[];
}) {
  const alertItems = alerts.slice(0, 4);
  const companyItems = companyUpdates.slice(0, 4);

  return (
    <div className="space-y-4">
      <TaskBlock
        title="緊急アラート"
        icon={AlertCircle}
        iconClass="text-danger"
        href="/alerts"
        count={alerts.length}
        empty="緊急のアラートはありません"
      >
        {alertItems.map((alert) => (
          <TaskRow
            key={alert.id}
            href={
              alert.relatedStudentId
                ? `/students/${alert.relatedStudentId}`
                : alert.relatedCaId
                  ? `/cas/${alert.relatedCaId}`
                  : "/alerts"
            }
            title={alert.title}
            subtitle={alert.description}
            variant="danger"
          />
        ))}
      </TaskBlock>

      <TaskBlock
        title="未共有の企業連絡"
        icon={Building2}
        iconClass="text-warning"
        href="/company-updates"
        count={companyUpdates.length}
        empty="未共有の連絡はありません"
      >
        {companyItems.map((u) => (
          <TaskRow
            key={u.id}
            href="/company-updates"
            title={u.companyName}
            subtitle={u.title}
            variant="warning"
          />
        ))}
      </TaskBlock>

      <div className="rounded-xl border border-border bg-background-subtle/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          ショートカット
        </p>
        <nav className="mt-2 space-y-1">
          {[
            { href: "/alerts", label: "フォローアラート一覧" },
            { href: "/company-updates", label: "企業連絡を共有" },
            { href: "/cas", label: "CAチームの状況" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-foreground-secondary transition-colors hover:bg-background hover:text-accent"
            >
              {item.label}
              <ChevronRight className="h-4 w-4 text-foreground-muted" />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

function TaskBlock({
  title,
  icon: Icon,
  iconClass,
  href,
  count,
  empty,
  children,
}: {
  title: string;
  icon: typeof AlertCircle;
  iconClass: string;
  href: string;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background shadow-xs">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", iconClass)} strokeWidth={2} />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {count > 0 && (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold tabular-nums text-background">
              {count}
            </span>
          )}
        </div>
        <Link
          href={href}
          className="text-xs font-medium text-accent hover:underline"
        >
          すべて
        </Link>
      </div>
      <div className="p-2">
        {count === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-foreground-muted">
            {empty}
          </p>
        ) : (
          <div className="space-y-1">{children}</div>
        )}
      </div>
    </div>
  );
}

function TaskRow({
  href,
  title,
  subtitle,
  variant,
}: {
  href: string;
  title: string;
  subtitle?: string;
  variant: "danger" | "warning";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-start gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-background-subtle",
        variant === "danger" && "border-l-2 border-l-danger",
        variant === "warning" && "border-l-2 border-l-warning"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-accent">
          {title}
        </p>
        {subtitle && (
          <p className="mt-0.5 line-clamp-2 text-xs text-foreground-muted">
            {subtitle}
          </p>
        )}
      </div>
      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground-muted opacity-0 group-hover:opacity-100" />
    </Link>
  );
}
