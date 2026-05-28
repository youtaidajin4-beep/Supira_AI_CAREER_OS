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
      <p className="text-sm text-foreground-muted">本日の活動はまだありません</p>
    );
  }

  return (
    <ul className={cn("space-y-0", compact ? "max-h-80 overflow-y-auto" : "")}>
      {logs.map((log) => (
        <li
          key={log.id}
          className={cn(
            "flex gap-3 border-b border-border-subtle py-3 last:border-0",
            log.severity === "critical" &&
              "border-l-[3px] border-l-danger bg-danger-subtle/10 pl-3",
            log.severity === "attention" &&
              "border-l-[3px] border-l-warning bg-warning-subtle/15 pl-3"
          )}
        >
          <span className="shrink-0 tabular-nums text-xs text-foreground-muted">
            {formatTime(log.createdAt)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground">{log.title}</p>
            {!compact && log.description && (
              <p className="mt-0.5 text-xs text-foreground-muted">
                {log.description}
              </p>
            )}
            <span className="mt-1 inline-block text-[10px] text-foreground-muted">
              {ACTIVITY_TYPE_LABELS[log.type]}
            </span>
          </div>
          {log.relatedStudentId && (
            <Link
              href={`/students/${log.relatedStudentId}`}
              className="shrink-0 text-xs text-accent hover:underline"
            >
              詳細
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
