import activityLogsSeed from "@/data/seed/activity-logs.json";
import { daysSince } from "@/lib/follow/alerts";
import { TEMPERATURE_LABELS } from "@/lib/data/types";
import type {
  ActivityLog,
  CompanyUpdate,
  Interview,
  Student,
} from "@/lib/data/types";
import { isDateToday } from "@/lib/utils/dates";

export function mergeActivityLogs(
  seed: ActivityLog[] = activityLogsSeed as ActivityLog[],
  students: Student[],
  interviews: Interview[],
  companyUpdates: CompanyUpdate[]
): ActivityLog[] {
  const generated: ActivityLog[] = [];
  const now = new Date();

  for (const student of students) {
    if (student.unreadDays >= 3) {
      generated.push({
        id: `gen-noreply-${student.id}`,
        type: "no_reply",
        title: `${student.name}さん：${student.unreadDays}日間返信なし`,
        description: `担当 ${student.assignedCaName}`,
        relatedStudentId: student.id,
        relatedStudentName: student.name,
        relatedCaId: student.assignedCaId,
        relatedCaName: student.assignedCaName,
        severity: student.unreadDays >= 7 ? "critical" : "attention",
        createdAt: new Date(
          now.getTime() - student.unreadDays * 3600000
        ).toISOString(),
      });
    }
    if (!student.nextAction?.trim()) {
      generated.push({
        id: `gen-action-${student.id}`,
        type: "next_action_missing",
        title: `${student.name}さん：次回アクション未設定`,
        description: "CAまたは代表で設定が必要です",
        relatedStudentId: student.id,
        relatedStudentName: student.name,
        relatedCaId: student.assignedCaId,
        relatedCaName: student.assignedCaName,
        severity: "attention",
        createdAt: student.updatedAt,
      });
    }
    if (daysSince(student.lastMemoUpdatedAt) <= 1) {
      generated.push({
        id: `gen-memo-${student.id}`,
        type: "memo_updated",
        title: `${student.assignedCaName}：面談メモを更新`,
        description: `${student.name}さんのカルテ`,
        relatedStudentId: student.id,
        relatedStudentName: student.name,
        relatedCaId: student.assignedCaId,
        relatedCaName: student.assignedCaName,
        severity: "info",
        createdAt: student.lastMemoUpdatedAt,
      });
    }
    if (student.temperature === "low" || student.temperature === "at_risk") {
      generated.push({
        id: `gen-temp-${student.id}`,
        type: "temperature_changed",
        title: `${student.name}さん：温度感「${TEMPERATURE_LABELS[student.temperature]}」`,
        description: "エンゲージメントに注意",
        relatedStudentId: student.id,
        relatedStudentName: student.name,
        severity: student.temperature === "at_risk" ? "critical" : "attention",
        createdAt: student.updatedAt,
      });
    }
  }

  for (const interview of interviews.filter((i) => isDateToday(i.createdAt))) {
    const student = students.find((s) => s.id === interview.studentId);
    if (!student) continue;
    generated.push({
      id: `gen-int-${interview.id}`,
      type: "interview_completed",
      title: `${student.name}さん：面談完了`,
      description: interview.summary || "面談記録あり",
      relatedStudentId: student.id,
      relatedStudentName: student.name,
      relatedCaId: student.assignedCaId,
      relatedCaName: student.assignedCaName,
      severity: "info",
      createdAt: interview.createdAt,
    });
  }

  for (const update of companyUpdates.filter((u) => isDateToday(u.createdAt))) {
    generated.push({
      id: `gen-cu-${update.id}`,
      type: "company_update",
      title: `${update.companyName}：${update.title}`,
      description: update.aiSummary || update.content.slice(0, 60),
      relatedCompanyName: update.companyName,
      severity: update.priority === "high" ? "attention" : "info",
      createdAt: update.createdAt,
    });
  }

  return [...seed, ...generated]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 30);
}

export function getTodayActivityFeed(logs: ActivityLog[]): ActivityLog[] {
  const today = logs.filter((l) => isDateToday(l.createdAt));
  if (today.length >= 3) return today.slice(0, 20);
  return logs.slice(0, 20);
}
