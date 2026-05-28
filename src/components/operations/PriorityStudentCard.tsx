import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import type { PriorityStudentCard as Card } from "@/lib/data/types";
import { PriorityLayerBadge } from "@/components/shared/PriorityLayerBadge";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { cn } from "@/lib/utils/cn";

export function PriorityStudentCard({ card }: { card: Card }) {
  const { student } = card;

  return (
    <Link
      href={`/students/${student.id}`}
      className={cn(
        "group block rounded-xl border border-border bg-background p-4 transition-all hover:border-accent/30 hover:shadow-sm",
        card.needsExecutiveAttention &&
          "border-l-[3px] border-l-warning bg-warning-subtle/30"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">{student.name}</span>
            <PriorityLayerBadge layer={card.priorityLayer} />
            <TemperatureBadge temperature={student.temperature} />
            {card.temperatureDroppedRecently && (
              <span className="rounded-md bg-warning-subtle px-2 py-0.5 text-[10px] font-medium text-warning">
                最近下降
              </span>
            )}
            {card.needsExecutiveAttention && (
              <span className="rounded-md bg-warning-subtle px-2 py-0.5 text-[10px] font-medium text-warning">
                代表注意
              </span>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-foreground-muted">
            <User className="h-3 w-3" />
            {student.assignedCaName} · 最終接触 {card.lastContactLabel}
          </p>
          {card.reasons.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {card.reasons.map((r) => (
                <span
                  key={r}
                  className="rounded-md bg-background-subtle px-2 py-0.5 text-[11px] text-foreground-secondary"
                >
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="mt-3 rounded-lg bg-accent-subtle/50 px-3 py-2 text-sm leading-relaxed text-foreground-secondary">
        {card.recommendedAction}
      </p>
    </Link>
  );
}
