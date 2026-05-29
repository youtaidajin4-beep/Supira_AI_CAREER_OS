import Link from "next/link";
import type { Student } from "@/lib/data/types";

function StudentLinks({
  title,
  students,
  empty,
}: {
  title: string;
  students: Student[];
  empty: string;
}) {
  return (
    <div className="executive-panel p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
        {title}
      </h3>
      {students.length === 0 ? (
        <p className="mt-3 text-sm text-foreground-muted">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {students.map((s) => (
            <li key={s.id}>
              <Link
                href={`/students/${s.id}`}
                className="text-sm font-medium text-foreground hover:text-accent"
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CARiskPanel({
  critical,
  attention,
}: {
  critical: Student[];
  attention: Student[];
}) {
  return (
    <div className="space-y-4">
      <StudentLinks
        title="今すぐ"
        students={critical}
        empty="該当なし"
      />
      <StudentLinks
        title="今日中"
        students={attention}
        empty="該当なし"
      />
    </div>
  );
}
