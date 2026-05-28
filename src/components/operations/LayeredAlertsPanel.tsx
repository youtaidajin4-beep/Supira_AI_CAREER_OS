import Link from "next/link";
import type { LayeredAlerts } from "@/lib/data/types";
import { PriorityLayerBadge } from "@/components/shared/PriorityLayerBadge";
import { cn } from "@/lib/utils/cn";

function LayerSection({
  layer,
  title,
  items,
}: {
  layer: "critical" | "attention" | "info";
  title: string;
  items: LayeredAlerts["critical"];
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <PriorityLayerBadge layer={layer} />
        <span className="text-xs font-medium text-foreground-muted">{title}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "rounded-lg border border-border-subtle px-3 py-2.5",
              layer === "critical" && "border-l-[3px] border-l-danger bg-danger-subtle/10",
              layer === "attention" &&
                "border-l-[3px] border-l-warning bg-warning-subtle/15",
              layer === "info" && "border-l-[3px] border-l-accent bg-accent-subtle/20"
            )}
          >
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            <p className="mt-0.5 text-xs text-foreground-secondary">
              {item.description}
            </p>
            {item.relatedStudentId && (
              <Link
                href={`/students/${item.relatedStudentId}`}
                className="mt-1 inline-block text-xs text-accent hover:underline"
              >
                学生を見る →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LayeredAlertsPanel({ alerts }: { alerts: LayeredAlerts }) {
  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        優先度別アラート
      </h3>
      <div className="space-y-5">
        <LayerSection
          layer="critical"
          title="今すぐ介入"
          items={alerts.critical}
        />
        <LayerSection
          layer="attention"
          title="今日中に確認"
          items={alerts.attention}
        />
        <LayerSection layer="info" title="確認のみ" items={alerts.info} />
      </div>
    </section>
  );
}
