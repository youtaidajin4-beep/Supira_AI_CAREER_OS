import Link from "next/link";
import type { Student } from "@/lib/data/types";
import { STATUS_LABELS } from "@/lib/data/types";
import { PriorityLayerBadge } from "@/components/shared/PriorityLayerBadge";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { classifyStudentLayer } from "@/lib/priority/layers";

export function CAStudentTable({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-foreground-muted">
        担当学生がいません
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-border-subtle text-[11px] font-medium uppercase tracking-wide text-foreground-muted">
            <th className="pb-3 pr-4 font-medium">学生</th>
            <th className="pb-3 pr-4 font-medium">優先度</th>
            <th className="pb-3 pr-4 font-medium">温度感</th>
            <th className="pb-3 font-medium">ステータス</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {students.map((s) => (
            <tr key={s.id} className="group hover:bg-background-subtle/50">
              <td className="py-3 pr-4">
                <Link
                  href={`/students/${s.id}`}
                  className="font-medium text-foreground group-hover:text-accent"
                >
                  {s.name}
                </Link>
              </td>
              <td className="py-3 pr-4">
                <PriorityLayerBadge layer={classifyStudentLayer(s)} />
              </td>
              <td className="py-3 pr-4">
                <TemperatureBadge temperature={s.temperature} />
              </td>
              <td className="py-3 text-foreground-muted">
                {STATUS_LABELS[s.status]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
