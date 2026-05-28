import { CheckCircle2, Circle, Send, Users } from "lucide-react";
import type { ShareStatus } from "@/lib/data/types";
import { SHARE_STATUS_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const config: Record<
  ShareStatus,
  { icon: typeof Circle; className: string }
> = {
  unshared: {
    icon: Circle,
    className: "bg-warning-subtle text-warning ring-warning/25",
  },
  shared_ca: {
    icon: Send,
    className: "bg-accent-subtle text-accent ring-accent/25",
  },
  shared_student: {
    icon: Users,
    className: "bg-accent-subtle text-accent ring-accent/25",
  },
  completed: {
    icon: CheckCircle2,
    className: "bg-success-subtle text-success ring-success/25",
  },
};

export function ShareStatusBadge({ status }: { status: ShareStatus }) {
  const { icon: Icon, className } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1",
        className
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {SHARE_STATUS_LABELS[status]}
    </span>
  );
}
