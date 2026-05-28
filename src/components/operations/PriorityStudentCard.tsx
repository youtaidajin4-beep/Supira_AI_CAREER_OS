import Link from "next/link";
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
        "block rounded-lg border border-border/70 px-4 py-3 transition-colors hover:bg-background-subtle/80",
        card.priorityLayer === "critical" && "border-l-2 border-l-danger/80",
        card.priorityLayer === "attention" && "border-l-2 border-l-warning/80"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-foreground">{student.name}</span>
        <PriorityLayerBadge layer={card.priorityLayer} />
        <TemperatureBadge temperature={student.temperature} />
        <span className="text-xs text-foreground-muted">
          {student.assignedCaName} · {card.lastContactLabel}
        </span>
      </div>
      {card.reasons.length > 0 && (
        <p className="mt-1.5 text-xs text-foreground-muted">
          {card.reasons.join(" · ")}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
        {card.recommendedAction}
      </p>
    </Link>
  );
}
