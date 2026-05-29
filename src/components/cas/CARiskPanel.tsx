import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import type { Student } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

function RiskBlock({
  title,
  icon: Icon,
  students,
  empty,
  tone,
}: {
  title: string;
  icon: typeof AlertTriangle;
  students: Student[];
  empty: string;
  tone: "critical" | "attention";
}) {
  const styles = {
    critical: {
      wrap: "from-red-50 to-white border-red-200/70",
      icon: "bg-danger text-white",
      link: "hover:bg-danger-subtle/30",
    },
    attention: {
      wrap: "from-amber-50 to-white border-amber-200/70",
      icon: "bg-warning text-white",
      link: "hover:bg-warning-subtle/40",
    },
  };
  const s = styles[tone];

  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-b p-4 shadow-sm",
        s.wrap
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", s.icon)}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="ml-auto rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold tabular-nums ring-1 ring-black/5">
          {students.length}
        </span>
      </div>
      {students.length === 0 ? (
        <p className="py-4 text-center text-sm text-foreground-muted">{empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {students.map((student) => (
            <li key={student.id}>
              <Link
                href={`/students/${student.id}`}
                className={cn(
                  "block rounded-lg bg-white/80 px-3 py-2 text-sm font-medium text-foreground ring-1 ring-black/5 transition-colors",
                  s.link
                )}
              >
                {student.name}
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
      <RiskBlock
        title="今すぐ確認"
        icon={AlertTriangle}
        students={critical}
        empty="該当なし"
        tone="critical"
      />
      <RiskBlock
        title="今日中に確認"
        icon={Clock}
        students={attention}
        empty="該当なし"
        tone="attention"
      />
    </div>
  );
}
