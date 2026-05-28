import Link from "next/link";
import type { ActivityLog } from "@/lib/data/types";
import { ACTIVITY_TYPE_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityFeed({
  logs,
  compact,
}: {
  logs: ActivityLog[];
  compact?: boolean;
}) {
  if (logs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-foreground-muted">
        本日の活動はまだありません
      </p>
    );
  }

  return (
    <ul
      className={cn(
        "relative",
        compact && "max-h-[min(22rem,50vh)] overflow-y-auto scroll-area pr-1"
      )}
    >
      <div
        className="absolute left-[4.25rem] top-2 bottom-2 w-px bg-border-subtle"
        aria-hidden
      />
      {logs.map((log, i) => (
        <li
          key={log.id}
          className={cn(
            "relative flex gap-3 py-2.5",
            i === 0 && "pt-0"
          )}
        >
          <span className="w-12 shrink-0 pt-0.5 text-right text-[11px] tabular-nums text-foreground-muted">
            {formatTime(log.createdAt)}
          </span>
          <span
            className={cn(
              "relative z-[1] mt-1.5 h-2 w-2 shrink-0 rounded-full ring-2 ring-background",
              log.severity === "critical" && "bg-danger",
              log.severity === "attention" && "bg-warning",
              log.severity === "info" && "bg-accent/70"
            )}
          />
          <div className="min-w-0 flex-1 pb-1">
            <p className="text-[13px] leading-snug text-foreground">
              {log.title}
            </p>
            {!compact && log.description && (
              <p className="mt-0.5 text-xs text-foreground-muted">
                {log.description}
              </p>
            )}
            <span className="mt-1 inline-block rounded-md bg-background-subtle px-1.5 py-0.5 text-[10px] text-foreground-muted">
              {ACTIVITY_TYPE_LABELS[log.type]}
            </span>
          </div>
          {log.relatedStudentId && (
            <Link
              href={`/students/${log.relatedStudentId}`}
              className="shrink-0 self-center text-[11px] font-medium text-accent/80 hover:text-accent hover:underline"
            >
              →
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
