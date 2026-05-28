import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import type { ExecutiveIntervention } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

export function InterventionPanel({
  interventions,
}: {
  interventions: ExecutiveIntervention[];
}) {
  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-foreground-muted" strokeWidth={1.75} />
        <h3 className="text-base font-semibold text-foreground">代表介入推奨</h3>
      </div>
      {interventions.length === 0 ? (
        <p className="text-sm text-foreground-muted">
          本日の代表介入候補はありません
        </p>
      ) : (
        <ul className="space-y-3">
          {interventions.slice(0, 6).map((item) => (
            <li
              key={item.id}
              className={cn(
                "rounded-lg border border-border-subtle px-4 py-3",
                item.severity === "critical" &&
                  "border-l-[3px] border-l-danger bg-danger-subtle/15",
                item.severity === "warning" &&
                  "border-l-[3px] border-l-warning bg-warning-subtle/20"
              )}
            >
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground-secondary">
                {item.description}
              </p>
              <Link
                href={
                  item.targetType === "ca"
                    ? `/cas/${item.targetId}`
                    : item.relatedStudentId
                      ? `/students/${item.relatedStudentId}`
                      : "/company-updates"
                }
                className="mt-2 inline-block text-xs font-medium text-accent hover:underline"
              >
                詳細を見る →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
