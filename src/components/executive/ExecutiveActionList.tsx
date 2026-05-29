import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { PriorityStudentCard } from "@/lib/data/types";
import { PriorityLayerBadge } from "@/components/shared/PriorityLayerBadge";
import { cn } from "@/lib/utils/cn";

const layerBorder = {
  critical: "border-l-danger bg-gradient-to-r from-danger-subtle/80 to-white",
  attention: "border-l-warning bg-gradient-to-r from-warning-subtle/60 to-white",
  info: "border-l-accent bg-gradient-to-r from-accent-subtle/50 to-white",
};

const rankBadge = {
  critical: "bg-danger text-white shadow-sm shadow-danger/30",
  attention: "bg-warning text-white",
  info: "bg-accent text-white",
  default: "bg-slate-700 text-white",
};

export function ExecutiveActionList({ cards }: { cards: PriorityStudentCard[] }) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-success-subtle">
          <Sparkles className="h-5 w-5 text-success" />
        </div>
        <p className="text-sm font-medium text-foreground">本日の優先対応はありません</p>
        <p className="mt-1 text-xs text-foreground-muted">チームは安定しています</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 p-4 sm:p-5">
      {cards.map((card, index) => (
        <li key={card.student.id}>
          <Link
            href={`/students/${card.student.id}`}
            className={cn(
              "group flex gap-4 rounded-xl border border-border-subtle border-l-4 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
              layerBorder[card.priorityLayer]
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold tabular-nums",
                index === 0 && card.priorityLayer === "critical"
                  ? rankBadge.critical
                  : index < 3
                    ? rankBadge.default
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
              </div>
              <p className="mt-0.5 text-xs text-foreground-muted">
                担当: {card.student.assignedCaName}
              </p>
              <p className="mt-2.5 rounded-lg bg-white/60 px-3 py-2 text-sm leading-relaxed text-foreground-secondary ring-1 ring-border-subtle/80">
                {card.recommendedAction}
              </p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-accent opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
