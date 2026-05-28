import type { Student } from "@/lib/data/types";
import { formatDate } from "@/lib/utils/dates";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";

interface InterviewStatusTabProps {
  student: Student;
}

export function InterviewStatusTab({ student }: InterviewStatusTabProps) {
  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-8">
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-foreground">面接状況</h4>
        <p className="mt-0.5 text-xs text-foreground-muted">
          企業ごとの選考ステージ
        </p>
      </div>

      {student.interviewStatus.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="面接情報が未登録です"
          description="基本情報タブから企業・ステータスを更新できます"
        />
      ) : (
        <div className="space-y-2">
          {student.interviewStatus.map((item) => (
            <div
              key={`${item.company}-${item.stage}`}
              className="flex items-center justify-between rounded-xl border border-border bg-background px-5 py-4 shadow-xs"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.company}
                </p>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  {item.stage}
                </p>
              </div>
              <span className="rounded-md bg-background-subtle px-2 py-1 text-[11px] tabular-nums text-foreground-muted">
                {formatDate(item.updatedAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
