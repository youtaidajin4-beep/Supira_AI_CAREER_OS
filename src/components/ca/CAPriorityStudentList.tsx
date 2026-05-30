import Link from "next/link";
import type { PriorityStudentCard } from "@/lib/data/types";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { STATUS_LABELS } from "@/lib/data/types";

export function CAPriorityStudentList({
  cards,
}: {
  cards: PriorityStudentCard[];
}) {
  if (cards.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-foreground-muted">
        本日の優先学生はありません
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border-subtle">
      {cards.map((card) => {
        const { student } = card;
        const riskLabel =
          card.reasons[0] ??
          student.riskReason ??
          (student.unreadDays >= 5
            ? `${student.unreadDays}日間未返信`
            : "要確認");

        return (
          <li key={student.id}>
            <Link
              href={`/ca/students/${student.id}`}
              className="flex flex-col gap-1.5 px-1 py-3 transition-colors hover:bg-background-subtle/60 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{student.name}</span>
                  <TemperatureBadge temperature={student.temperature} />
                </div>
                <p className="text-xs text-foreground-muted">
                  {student.university} · {STATUS_LABELS[student.status]}
                </p>
              </div>
              <div className="text-left sm:max-w-[45%] sm:text-right">
                <p className="text-xs font-medium text-danger/90">{riskLabel}</p>
                <p className="mt-0.5 text-xs text-foreground-secondary">
                  次: {student.nextAction || "未設定"}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
