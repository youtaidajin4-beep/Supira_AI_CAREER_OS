import type { PriorityLayer } from "@/lib/data/types";
import { PRIORITY_LAYER_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

export function PriorityLayerBadge({
  layer,
  className,
}: {
  layer: PriorityLayer;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium",
        layer === "critical" && "bg-danger-subtle text-danger",
        layer === "attention" && "bg-warning-subtle text-warning",
        layer === "info" && "bg-accent-subtle text-accent",
        className
      )}
    >
      {PRIORITY_LAYER_LABELS[layer]}
    </span>
  );
}
