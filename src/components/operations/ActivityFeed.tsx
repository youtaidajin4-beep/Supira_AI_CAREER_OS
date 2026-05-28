import Link from "next/link";
import type { ActivityLog } from "@/lib/data/types";
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
    return <p className="text-sm text-foreground-muted">活動なし</p>;
  }

  return (
    <ul
      className={cn(
        "divide-y divide-border-subtle",
        compact && "max-h-64 overflow-y-auto scroll-area"
      )}
    >
      {logs.map((log) => (
        <li key={log.id} className="flex gap-3 py-2 first:pt-0 last:pb-0">
          <span className="w-10 shrink-0 text-[11px] tabular-nums text-foreground-muted">
            {formatTime(log.createdAt)}
          </span>
          <div className="min-w-0 flex-1">
            {log.relatedStudentId ? (
              <Link
                href={`/students/${log.relatedStudentId}`}
                className="text-sm text-foreground hover:text-accent"
              >
                {log.title}
              </Link>
            ) : (
              <p className="text-sm text-foreground">{log.title}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
