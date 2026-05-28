import { computeFollowIssues, highestSeverity } from "@/lib/follow/alerts";
import type { Student } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

interface FollowIndicatorProps {
  student: Student;
  className?: string;
}

const dotColors = {
  critical: "bg-danger",
  warning: "bg-warning",
  info: "bg-accent",
};

export function FollowIndicator({ student, className }: FollowIndicatorProps) {
  const issues = computeFollowIssues(student);
  const severity = highestSeverity(issues);
  if (!severity) return null;

  const top = issues[0];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] text-foreground-muted",
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", dotColors[severity])}
        aria-hidden
      />
      {top.title}
    </span>
  );
}
