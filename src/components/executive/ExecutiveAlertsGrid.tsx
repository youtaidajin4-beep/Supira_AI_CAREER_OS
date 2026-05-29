import Link from "next/link";
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
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-foreground-muted">
        {title}
        <span className="ml-1 font-normal tabular-nums">({items.length})</span>
      </p>
      <ul className="space-y-1">
        {items.length === 0 ? (
          <li className="text-xs text-foreground-muted">—</li>
        ) : (
          items.slice(0, 4).map((item) => (
            <li key={item.id}>
              <Link
                href={
                  item.relatedStudentId
                    ? `/students/${item.relatedStudentId}`
                    : "/alerts"
                }
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm hover:bg-white",
                  tone === "critical" && "font-medium text-foreground",
                  tone === "attention" && "text-foreground-secondary"
                )}
              >
                {item.title}
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
    <div className="executive-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">優先度別アラート</h2>
        <Link href="/alerts" className="text-xs font-medium text-accent">
          一覧 →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <Column title="今すぐ" tone="critical" items={alerts.critical} />
        <Column title="今日中" tone="attention" items={alerts.attention} />
        <Column title="確認" tone="info" items={alerts.info} />
      </div>
    </div>
  );
}
