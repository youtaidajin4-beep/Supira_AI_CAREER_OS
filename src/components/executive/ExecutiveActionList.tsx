import Link from "next/link";
import type { PriorityStudentCard } from "@/lib/data/types";
import { PriorityLayerBadge } from "@/components/shared/PriorityLayerBadge";
import { cn } from "@/lib/utils/cn";

export function ExecutiveActionList({ cards }: { cards: PriorityStudentCard[] }) {
  if (cards.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-foreground-muted">
        本日の優先対応はありません
      </p>
    );
  }

  return (
    <ol className="divide-y divide-border-subtle">
      {cards.map((card, index) => (
        <li key={card.student.id}>
          <Link
            href={`/students/${card.student.id}`}
            className={cn(
              "group flex gap-4 px-1 py-4 transition-colors hover:bg-background-subtle/60",
              card.priorityLayer === "critical" && "bg-danger-subtle/10"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                index === 0 && card.priorityLayer === "critical"
                  ? "bg-danger text-white"
                  : index < 3
                    ? "bg-foreground text-white"
                    : "bg-background-muted text-foreground-muted"
              )}
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-foreground">
                  {card.student.name}
                </span>
                <PriorityLayerBadge layer={card.priorityLayer} />
                <span className="text-xs text-foreground-muted">
                  {card.student.assignedCaName}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                {card.recommendedAction}
              </p>
            </div>
            <span className="hidden shrink-0 self-center text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100 sm:inline">
              開く →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
