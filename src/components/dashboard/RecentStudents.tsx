import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Student } from "@/lib/data/types";
import { STATUS_LABELS } from "@/lib/data/types";
import { formatDate } from "@/lib/utils/dates";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";

interface RecentStudentsProps {
  students: Student[];
}

export function RecentStudents({ students }: RecentStudentsProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader title="最近追加された学生" description="新規登録順" />
      <ul className="divide-y divide-border-subtle">
        {students.map((student) => (
          <li key={student.id}>
            <Link
              href={`/students/${student.id}`}
              className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-background-subtle/80"
            >
              <Avatar name={student.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-accent">
                  {student.name}
                </p>
                <p className="truncate text-xs text-foreground-muted">
                  {student.university} · {STATUS_LABELS[student.status]}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <TemperatureBadge temperature={student.temperature} />
                <span className="text-[10px] tabular-nums text-foreground-muted">
                  {formatDate(student.createdAt)}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-border transition-transform group-hover:translate-x-0.5 group-hover:text-foreground-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
