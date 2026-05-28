import type { Alert, AlertSeverity, AlertType, Student } from "@/lib/data/types";

const MS_PER_DAY = 86400000;

export interface FollowIssue {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
}

export function daysSince(iso: string | undefined): number {
  if (!iso) return 999;
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / MS_PER_DAY);
}

export function computeFollowIssues(student: Student): FollowIssue[] {
  const issues: FollowIssue[] = [];

  if (daysSince(student.lastMemoUpdatedAt) >= 7) {
    issues.push({
      type: "memo_stale",
      severity: "warning",
      title: "メモ未更新",
      description: "7日以上メモが更新されていません",
    });
  }

  const contactStale =
    student.unreadDays >= 7 || daysSince(student.lastContactAt) >= 7;
  if (contactStale) {
    issues.push({
      type: "contact_stale",
      severity: "warning",
      title: "連絡停滞",
      description: "7日以上学生との連絡がありません",
    });
  }

  if (!student.nextAction?.trim()) {
    issues.push({
      type: "no_next_action",
      severity: "info",
      title: "次回アクション未設定",
      description: "次に取るべきアクションが未設定です",
    });
  }

  if (
    student.status === "selecting" &&
    student.interviewStatus.length > 0
  ) {
    const latest = student.interviewStatus.reduce((a, b) =>
      new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b
    );
    if (daysSince(latest.updatedAt) >= 14) {
      issues.push({
        type: "selection_stale",
        severity: "warning",
        title: "選考進捗の停滞",
        description: "選考中ですが進捗更新が2週間以上ありません",
      });
    }
  }

  if (student.temperature === "low") {
    issues.push({
      type: "temperature",
      severity: "warning",
      title: "温度感: 低",
      description: "エンゲージメントが低下しています",
    });
  }

  if (student.temperature === "at_risk") {
    issues.push({
      type: "temperature",
      severity: "critical",
      title: "離脱リスク",
      description: student.riskReason || "離脱リスクが検出されています",
    });
  }

  return issues;
}

export function followScore(student: Student): number {
  const issues = computeFollowIssues(student);
  let score = 0;
  for (const issue of issues) {
    if (issue.severity === "critical") score += 30;
    else if (issue.severity === "warning") score += 15;
    else score += 5;
  }
  if (student.unreadDays >= 7) score += 10;
  return score;
}

export function studentToAlerts(student: Student): Alert[] {
  return computeFollowIssues(student).map((issue, i) => ({
    id: `dyn-${student.id}-${issue.type}-${i}`,
    type: issue.type,
    title: `${issue.title}: ${student.name}`,
    description: issue.description,
    relatedCaId: student.assignedCaId,
    relatedStudentId: student.id,
    severity: issue.severity,
    resolved: false,
    createdAt: new Date().toISOString(),
  }));
}

export function mergeAlerts(
  seed: Alert[],
  students: Student[],
  includeResolved = false
): Alert[] {
  const dynamic = students.flatMap(studentToAlerts);
  const byKey = new Map<string, Alert>();

  for (const a of [...seed, ...dynamic]) {
    if (!includeResolved && a.resolved) continue;
    const key = `${a.type}-${a.relatedStudentId ?? ""}-${a.title}`;
    const existing = byKey.get(key);
    if (!existing || severityRank(a.severity) > severityRank(existing.severity)) {
      byKey.set(key, a);
    }
  }

  return Array.from(byKey.values()).sort(
    (a, b) => severityRank(b.severity) - severityRank(a.severity)
  );
}

function severityRank(s: AlertSeverity): number {
  if (s === "critical") return 3;
  if (s === "warning") return 2;
  return 1;
}

export function highestSeverity(
  issues: FollowIssue[]
): AlertSeverity | null {
  if (issues.length === 0) return null;
  if (issues.some((i) => i.severity === "critical")) return "critical";
  if (issues.some((i) => i.severity === "warning")) return "warning";
  return "info";
}
