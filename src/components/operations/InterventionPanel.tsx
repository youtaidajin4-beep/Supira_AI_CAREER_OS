import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import type { ExecutiveIntervention } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { cn } from "@/lib/utils/cn";

export function InterventionPanel({
  interventions,
  compact,
}: {
  interventions: ExecutiveIntervention[];
  compact?: boolean;
}) {
  const list = interventions.slice(0, compact ? 3 : 6);

  return (
    <DashboardSection
      title="代表介入推奨"
      subtitle="代表の声かけが効果的な候補"
      badge={interventions.length}
      bodyClassName={compact ? "!py-3 sm:!py-4" : undefined}
      variant={compact ? "flat" : "elevated"}
    >
      {list.length === 0 ? (
        <p className="text-sm text-foreground-muted">
          本日の代表介入候補はありません
        </p>
      ) : (
        <ul className="space-y-2">
          {list.map((item) => (
            <li
              key={item.id}
              className={cn(
                "rounded-xl px-3 py-2.5",
                item.severity === "critical" &&
                  "border-l-[3px] border-l-danger/80 bg-danger-subtle/20",
                item.severity === "warning" &&
                  "border-l-[3px] border-l-warning/80 bg-warning-subtle/25"
              )}
            >
              <div className="flex items-start gap-2">
                <ShieldAlert
                  className={cn(
                    "mt-0.5 h-3.5 w-3.5 shrink-0",
                    item.severity === "critical"
                      ? "text-danger"
                      : "text-warning"
                  )}
                  strokeWidth={1.75}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {item.title}
                  </p>
                  {!compact && (
                    <p className="mt-0.5 text-xs text-foreground-muted">
                      {item.description}
                    </p>
                  )}
                  <Link
                    href={
                      item.targetType === "ca"
                        ? `/cas/${item.targetId}`
                        : item.relatedStudentId
                          ? `/students/${item.relatedStudentId}`
                          : "/company-updates"
                    }
                    className="mt-1 inline-block text-[11px] font-medium text-accent hover:underline"
                  >
                    詳細 →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
