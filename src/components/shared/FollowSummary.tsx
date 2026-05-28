"use client";

import { computeFollowIssues } from "@/lib/follow/alerts";
import type { Student } from "@/lib/data/types";
import { SeverityBanner } from "./SeverityBanner";

export function FollowSummary({ student }: { student: Student }) {
  const issues = computeFollowIssues(student).filter(
    (i) => i.severity !== "info"
  );
  if (issues.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {issues.slice(0, 2).map((issue) => (
        <SeverityBanner
          key={issue.type}
          severity={issue.severity}
          title={issue.title}
          description={issue.description}
        />
      ))}
    </div>
  );
}
