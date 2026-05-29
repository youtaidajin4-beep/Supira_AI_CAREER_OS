import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import type { LayeredAlerts } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

function Column({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "critical" | "attention" | "info";
  items: LayeredAlerts["critical"];
}) {
  const styles = {
    critical: {
      panel: "from-red-50 to-white border-red-200/80",
      badge: "bg-danger text-white",
      dot: "bg-danger",
    },
    attention: {
      panel: "from-amber-50 to-white border-amber-200/80",
      badge: "bg-warning text-white",
      dot: "bg-warning",
    },
    info: {
      panel: "from-sky-50 to-white border-sky-200/80",
      badge: "bg-accent text-white",
      dot: "bg-accent",
    },
  };
  const s = styles[tone];

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-gradient-to-b p-4 shadow-sm",
        s.panel
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", s.dot)} />
          <p className="text-sm font-semibold text-foreground">{title}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
            s.badge
          )}
        >
          {items.length}
        </span>
      </div>
      <ul className="min-h-[4rem] flex-1 space-y-1.5">
        {items.length === 0 ? (
          <li className="py-4 text-center text-xs text-foreground-muted">該当なし</li>
        ) : (
          items.slice(0, 4).map((item) => (
            <li key={item.id}>
              <Link
                href={
                  item.relatedStudentId
                    ? `/students/${item.relatedStudentId}`
                    : "/alerts"
                }
                className="flex items-start gap-2 rounded-lg bg-white/70 px-2.5 py-2 text-sm text-foreground-secondary ring-1 ring-black/5 transition-colors hover:bg-white hover:text-foreground"
              >
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground-muted" />
                <span className={tone === "critical" ? "font-medium text-foreground" : ""}>
                  {item.title}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export function ExecutiveAlertsGrid({ alerts }: { alerts: LayeredAlerts }) {
  return (
    <section className="executive-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-subtle bg-gradient-to-r from-slate-50 to-white px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger text-white">
            <Bell className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-foreground">優先度別アラート</h2>
            <p className="text-xs text-foreground-muted">緊急度で整理</p>
          </div>
        </div>
        <Link href="/alerts" className="text-xs font-medium text-accent hover:underline">
          一覧 →
        </Link>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-3">
        <Column title="今すぐ" tone="critical" items={alerts.critical} />
        <Column title="今日中" tone="attention" items={alerts.attention} />
        <Column title="確認" tone="info" items={alerts.info} />
      </div>
    </section>
  );
}
