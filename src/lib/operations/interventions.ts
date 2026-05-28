import type {
  CAAttentionSummary,
  CAUser,
  CompanyUpdate,
  ExecutiveIntervention,
  Student,
} from "@/lib/data/types";
import { hasTemperatureDropped } from "@/lib/temperature/score";
import { getTemperatureHistoryForStudent } from "@/lib/temperature/history";

export function buildExecutiveInterventions(
  students: Student[],
  cas: CAUser[],
  caAttentionList: CAAttentionSummary[],
  companyUpdates: CompanyUpdate[]
): ExecutiveIntervention[] {
  const items: ExecutiveIntervention[] = [];

  for (const student of students) {
    if (student.unreadDays >= 14 || student.temperature === "at_risk") {
      items.push({
        id: `int-stu-${student.id}`,
        targetType: "student",
        targetId: student.id,
        targetName: student.name,
        title: `${student.name}さん — 代表フォロー推奨`,
        description: `${student.assignedCaName}担当。${student.unreadDays}日以上未返信または離脱リスクが高い状態です。`,
        severity: "critical",
        relatedCaId: student.assignedCaId,
        relatedStudentId: student.id,
      });
    } else if (
      hasTemperatureDropped(
        student.temperature,
        getTemperatureHistoryForStudent(student)
      )
    ) {
      items.push({
        id: `int-temp-${student.id}`,
        targetType: "student",
        targetId: student.id,
        targetName: student.name,
        title: `${student.name}さん — 温度感が急低下`,
        description: "最近のエンゲージメント低下が見られます。代表またはシニアCAの声かけを検討してください。",
        severity: "warning",
        relatedCaId: student.assignedCaId,
        relatedStudentId: student.id,
      });
    }
  }

  for (const summary of caAttentionList) {
    if (
      summary.ca.performanceStatus === "needs_support" ||
      summary.delayedReplyCount >= 3
    ) {
      items.push({
        id: `int-ca-${summary.ca.id}`,
        targetType: "ca",
        targetId: summary.ca.id,
        targetName: summary.ca.name,
        title: `${summary.ca.name} — CAチーム要支援`,
        description: summary.aiComment,
        severity: "warning",
        relatedCaId: summary.ca.id,
      });
    }
  }

  const urgentUnshared = companyUpdates.filter(
    (u) => u.shareStatus === "unshared" && u.priority === "high"
  );
  for (const u of urgentUnshared.slice(0, 2)) {
    items.push({
      id: `int-cu-${u.id}`,
      targetType: "student",
      targetId: u.id,
      targetName: u.companyName,
      title: `企業連絡未共有: ${u.companyName}`,
      description: `「${u.title}」が未共有です。担当CAへの共有を今日中に推奨します。`,
      severity: "warning",
    });
  }

  return items.sort(
    (a, b) =>
      (b.severity === "critical" ? 2 : b.severity === "warning" ? 1 : 0) -
      (a.severity === "critical" ? 2 : a.severity === "warning" ? 1 : 0)
  );
}

export function needsExecutiveAttention(
  student: Student,
  interventions: ExecutiveIntervention[]
): boolean {
  return interventions.some((i) => i.relatedStudentId === student.id);
}
