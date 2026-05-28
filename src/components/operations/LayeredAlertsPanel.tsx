import Link from "next/link";
import type { LayeredAlerts } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { cn } from "@/lib/utils/cn";

function LayerColumn({
  layer,
  title,
  items,
}: {
  layer: "critical" | "attention" | "info";
  title: string;
  items: LayeredAlerts["critical"];
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium text-foreground-muted">
        {title}
        <span className="ml-1 tabular-nums">({items.length})</span>
      </p>
      {items.length === 0 ? (
        <p className="text-xs text-foreground-muted">—</p>
      ) : (
        <ul className="space-y-1.5">
          {items.slice(0, 3).map((item) => (
            <li key={item.id}>
              <Link
                href={
                  item.relatedStudentId
                    ? `/students/${item.relatedStudentId}`
                    : "/alerts"
                }
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm hover:bg-background-subtle",
                  layer === "critical" && "text-foreground",
                  layer === "attention" && "text-foreground-secondary",
                  layer === "info" && "text-foreground-muted"
                )}
              >
                <span className="line-clamp-1 font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function LayeredAlertsPanel({ alerts }: { alerts: LayeredAlerts }) {
  const total =
    alerts.critical.length + alerts.attention.length + alerts.info.length;

  return (
    <DashboardSection title="アラート" href="/alerts" badge={total}>
      <div className="grid gap-4 sm:grid-cols-3">
        <LayerColumn
          layer="critical"
          title="今すぐ"
          items={alerts.critical}
        />
        <LayerColumn layer="attention" title="今日中" items={alerts.attention} />
        <LayerColumn layer="info" title="確認" items={alerts.info} />
      </div>
    </DashboardSection>
  );
}
