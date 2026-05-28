import Link from "next/link";
import type { LayeredAlerts } from "@/lib/data/types";
import { PriorityLayerBadge } from "@/components/shared/PriorityLayerBadge";
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
    <div className="min-w-0 flex-1">
      <div className="mb-3 flex items-center gap-2">
        <PriorityLayerBadge layer={layer} />
        <span className="text-xs font-medium text-foreground-muted">{title}</span>
        <span className="ml-auto text-[10px] tabular-nums text-foreground-muted">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="rounded-lg bg-background-subtle/80 px-3 py-6 text-center text-xs text-foreground-muted">
          なし
        </p>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 4).map((item) => (
            <li
              key={item.id}
              className={cn(
                "rounded-xl border border-border-subtle px-3 py-2.5 transition-colors hover:bg-background-subtle/50",
                layer === "critical" &&
                  "border-l-[3px] border-l-danger/80 bg-danger-subtle/20",
                layer === "attention" &&
                  "border-l-[3px] border-l-warning/80 bg-warning-subtle/25",
                layer === "info" &&
                  "border-l-[3px] border-l-accent/60 bg-accent-subtle/30"
              )}
            >
              <p className="text-sm font-medium leading-snug text-foreground">
                {item.title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-foreground-muted">
                {item.description}
              </p>
              {item.relatedStudentId && (
                <Link
                  href={`/students/${item.relatedStudentId}`}
                  className="mt-1.5 inline-block text-[11px] font-medium text-accent hover:underline"
                >
                  開く
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function LayeredAlertsPanel({
  alerts,
  layout = "grid",
}: {
  alerts: LayeredAlerts;
  layout?: "grid" | "stack";
}) {
  const total =
    alerts.critical.length + alerts.attention.length + alerts.info.length;

  const content =
    layout === "grid" ? (
      <div className="grid gap-6 lg:grid-cols-3">
        <LayerColumn
          layer="critical"
          title="今すぐ介入"
          items={alerts.critical}
        />
        <LayerColumn
          layer="attention"
          title="今日中に確認"
          items={alerts.attention}
        />
        <LayerColumn layer="info" title="確認のみ" items={alerts.info} />
      </div>
    ) : (
      <div className="space-y-5">
        <LayerColumn
          layer="critical"
          title="今すぐ介入"
          items={alerts.critical}
        />
        <LayerColumn
          layer="attention"
          title="今日中に確認"
          items={alerts.attention}
        />
        <LayerColumn layer="info" title="確認のみ" items={alerts.info} />
      </div>
    );

  return (
    <DashboardSection
      title="優先度別アラート"
      subtitle="Critical → Attention → Info の順で確認"
      href="/alerts"
      badge={total}
      bodyClassName="!py-4 sm:!py-5"
    >
      {content}
    </DashboardSection>
  );
}
