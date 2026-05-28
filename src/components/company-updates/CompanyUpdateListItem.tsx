import { Building2, Calendar } from "lucide-react";
import type { CompanyUpdate } from "@/lib/data/types";
import { PriorityBadge } from "./PriorityBadge";
import { ShareStatusBadge } from "./ShareStatusBadge";
import { cn } from "@/lib/utils/cn";

function formatDeadline(iso: string) {
  if (!iso) return "期限未設定";
  return new Date(iso).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
  });
}

export function CompanyUpdateListItem({
  update,
  selected,
  onSelect,
}: {
  update: CompanyUpdate;
  selected: boolean;
  onSelect: () => void;
}) {
  const isUnshared = update.shareStatus === "unshared";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group w-full rounded-xl border p-4 text-left transition-all duration-150",
        selected
          ? "border-accent bg-accent-subtle/40 shadow-sm ring-1 ring-accent/20"
          : "border-border bg-background hover:border-border hover:bg-background-subtle/80 hover:shadow-xs",
        isUnshared && !selected && "border-l-[3px] border-l-warning"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              selected ? "bg-accent/10" : "bg-background-subtle"
            )}
          >
            <Building2
              className={cn(
                "h-5 w-5",
                selected ? "text-accent" : "text-foreground-muted"
              )}
              strokeWidth={1.75}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {update.companyName}
            </p>
            <p className="mt-0.5 line-clamp-2 text-sm text-foreground-secondary">
              {update.title}
            </p>
          </div>
        </div>
        <PriorityBadge priority={update.priority} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ShareStatusBadge status={update.shareStatus} />
        <span className="inline-flex items-center gap-1 text-[11px] text-foreground-muted">
          <Calendar className="h-3 w-3" strokeWidth={2} />
          期限 {formatDeadline(update.deadline)}
        </span>
      </div>

      {update.content && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-foreground-muted">
          {update.content}
        </p>
      )}
    </button>
  );
}
