import { AlertTriangle, Calendar } from "lucide-react";
import type { Student } from "@/lib/data/types";
import { STATUS_LABELS } from "@/lib/data/types";
import { TemperatureBadge } from "./TemperatureBadge";
import { Avatar } from "@/components/ui/avatar";
import { EntityLink } from "@/components/shared/EntityLink";
import { FollowSummary } from "@/components/shared/FollowSummary";
import { cn } from "@/lib/utils/cn";

interface StudentKarteProps {
  student: Student;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ja-JP");
}

export function StudentKarte({ student }: StudentKarteProps) {
  return (
    <div className="border-b border-border bg-background px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <Avatar name={student.name} size="md" />
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
              {student.name}
            </h2>
            <p className="mt-0.5 truncate text-sm text-foreground-muted">
              {student.university}
              <span className="mx-1.5 text-border">·</span>
              {student.grade}
              <span className="mx-1.5 text-border">·</span>
              {student.industry}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
              <span>
                担当:{" "}
                <EntityLink href={`/cas/${student.assignedCaId}`}>
                  {student.assignedCaName}
                </EntityLink>
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                最終接触 {formatDate(student.lastContactAt)}
              </span>
              {student.nextAction ? (
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-foreground-secondary",
                    student.nextActionStatus === "done"
                      ? "bg-success-subtle/80"
                      : "bg-accent-subtle/60"
                  )}
                >
                  次: {student.nextAction}
                  {student.nextActionDue &&
                    `（${formatDate(student.nextActionDue)}まで）`}
                  {student.nextActionAssignee === "executive" && " · 代表担当"}
                </span>
              ) : (
                <span className="rounded-md border border-l-[3px] border-l-warning border-border bg-warning-subtle/40 px-2 py-0.5 text-warning">
                  次回アクション未設定
                </span>
              )}
            </div>
            {student.targetCompanies.length > 0 && (
              <div className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                {student.targetCompanies.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="rounded-md bg-background-subtle px-2 py-0.5 text-[11px] font-medium text-foreground-secondary ring-1 ring-border/80"
                  >
                    {c}
                  </span>
                ))}
                {student.targetCompanies.length > 3 && (
                  <span className="text-[11px] text-foreground-muted">
                    +{student.targetCompanies.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <TemperatureBadge temperature={student.temperature} />
          <span className="rounded-full bg-background-subtle px-3 py-1 text-xs font-medium text-foreground-secondary ring-1 ring-border">
            {STATUS_LABELS[student.status]}
          </span>
        </div>
      </div>

      <FollowSummary student={student} />

      {student.unreadDays >= 7 && (
        <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle px-3 py-2.5">
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-danger"
            strokeWidth={1.75}
          />
          <div>
            <p className="text-sm font-medium text-danger">
              {student.unreadDays}日間未返信 — 要フォロー
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
