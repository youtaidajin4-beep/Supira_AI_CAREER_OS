import Link from "next/link";
import { ArrowUpRight, User } from "lucide-react";
import type { PriorityStudentCard as Card } from "@/lib/data/types";
import { PriorityLayerBadge } from "@/components/shared/PriorityLayerBadge";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { cn } from "@/lib/utils/cn";

export function PriorityStudentCard({
  card,
  rank,
}: {
  card: Card;
  rank?: number;
}) {
  const { student } = card;

  return (
    <Link
      href={`/students/${student.id}`}
      className={cn(
        "group relative flex gap-4 rounded-xl border border-border/80 bg-background p-4 transition-all duration-200",
        "hover:border-accent/25 hover:shadow-[var(--shadow-card-hover)]",
        card.priorityLayer === "critical" &&
          "border-l-[3px] border-l-danger/70 bg-danger-subtle/15",
        card.priorityLayer === "attention" &&
          !card.needsExecutiveAttention &&
          "border-l-[3px] border-l-warning/70 bg-warning-subtle/20",
        card.needsExecutiveAttention &&
          "border-l-[3px] border-l-warning bg-warning-subtle/25"
      )}
    >
      {rank !== undefined && (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold tabular-nums",
            rank === 1 && "bg-foreground text-background",
            rank === 2 && "bg-foreground-secondary text-background",
            rank === 3 && "bg-background-subtle text-foreground-secondary",
            rank > 3 && "bg-background-subtle text-foreground-muted"
          )}
        >
          {rank}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground">{student.name}</span>
          <PriorityLayerBadge layer={card.priorityLayer} />
          <TemperatureBadge temperature={student.temperature} />
          {card.temperatureDroppedRecently && (
            <span className="rounded-md bg-warning-subtle px-2 py-0.5 text-[10px] font-medium text-warning">
              下降
            </span>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-foreground-muted">
          <User className="h-3 w-3" />
          {student.assignedCaName} · {card.lastContactLabel}
        </p>
        {card.reasons.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {card.reasons.map((r) => (
              <span
                key={r}
                className="rounded-md border border-border-subtle bg-background-subtle/80 px-2 py-0.5 text-[11px] text-foreground-secondary"
              >
                {r}
              </span>
            ))}
          </div>
        )}
        <p className="mt-3 rounded-lg border border-accent/10 bg-accent-subtle/40 px-3 py-2.5 text-[13px] leading-relaxed text-foreground-secondary">
          {card.recommendedAction}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground-muted/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
    </Link>
  );
}
