import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import type { PriorityStudent } from "@/lib/data/types";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { cn } from "@/lib/utils/cn";

export function TodayPriorityPanel({
  items,
}: {
  items: PriorityStudent[];
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          本日、優先対応が必要な学生はありません
        </p>
        <p className="mt-1 text-xs text-foreground-muted">
          新しいアラートが出るとここに表示されます
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-2">
      {items.map(({ student, score, reasons }, index) => (
        <li key={student.id}>
          <Link
            href={`/students/${student.id}`}
            className={cn(
              "group flex items-stretch gap-0 overflow-hidden rounded-xl border bg-background transition-all",
              "hover:border-accent/40 hover:shadow-md",
              index === 0
                ? "border-danger/30 ring-1 ring-danger/10"
                : "border-border"
            )}
          >
            <div
              className={cn(
                "flex w-11 shrink-0 flex-col items-center justify-center text-sm font-bold tabular-nums",
                index === 0
                  ? "bg-danger-subtle text-danger"
                  : index < 3
                    ? "bg-warning-subtle text-warning"
                    : "bg-background-subtle text-foreground-muted"
              )}
            >
              {index + 1}
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background-subtle">
                <User className="h-4 w-4 text-foreground-muted" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground group-hover:text-accent">
                    {student.name}
                  </span>
                  <TemperatureBadge temperature={student.temperature} />
                  <span className="rounded-md bg-background-subtle px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-foreground-muted">
                    優先 {score}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  担当 {student.assignedCaName}
                  {student.university && ` · ${student.university}`}
                </p>
                {reasons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {reasons.map((r) => (
                      <span
                        key={r}
                        className="rounded-md bg-warning-subtle/80 px-2 py-0.5 text-[11px] font-medium text-warning"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}
                {student.nextAction && (
                  <p className="mt-2 text-xs text-foreground-secondary">
                    <span className="font-medium text-foreground-muted">次:</span>{" "}
                    {student.nextAction}
                  </p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
