import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { PriorityStudent } from "@/lib/data/types";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { FollowIndicator } from "@/components/shared/FollowIndicator";

export function TodayPriorityList({
  items,
}: {
  items: PriorityStudent[];
}) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        今日見るべき学生
      </h3>
      <ul className="divide-y divide-border-subtle">
        {items.map(({ student, reasons }) => (
          <li key={student.id} className="flex items-center gap-3 py-3 first:pt-0">
            <div className="min-w-0 flex-1">
              <Link
                href={`/students/${student.id}`}
                className="font-medium text-foreground hover:text-accent"
              >
                {student.name}
              </Link>
              <p className="text-xs text-foreground-muted">
                {student.assignedCaName} · {reasons.join(" · ")}
              </p>
              <FollowIndicator student={student} className="mt-1" />
            </div>
            <TemperatureBadge temperature={student.temperature} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
