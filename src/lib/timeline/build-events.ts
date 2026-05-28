import { computeFollowIssues, daysSince } from "@/lib/follow/alerts";
import type {
  Interview,
  Student,
  TimelineEvent,
  TemperatureSnapshot,
} from "@/lib/data/types";
import { TEMPERATURE_LABELS } from "@/lib/data/types";

export function buildStudentTimeline(
  student: Student,
  interviews: Interview[],
  temperatureHistory: TemperatureSnapshot[]
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const interview of interviews.filter(
    (i) => i.studentId === student.id
  )) {
    events.push({
      id: `tl-int-${interview.id}`,
      studentId: student.id,
      type: "interview",
      title: "面談実施",
      description: interview.summary || "面談記録あり",
      occurredAt: interview.createdAt,
    });
  }

  if (student.lastMemoUpdatedAt) {
    events.push({
      id: `tl-memo-${student.id}`,
      studentId: student.id,
      type: "memo",
      title: "カルテメモ更新",
      description: "CAメモまたは連絡メモが更新されました",
      occurredAt: student.lastMemoUpdatedAt,
    });
  }

  if (student.lastContactAt) {
    events.push({
      id: `tl-contact-${student.id}`,
      studentId: student.id,
      type: "contact",
      title: "学生と連絡",
      description:
        student.unreadDays >= 7
          ? `${student.unreadDays}日以上返信なし`
          : "直近のやり取りあり",
      occurredAt: student.lastContactAt,
      severity: student.unreadDays >= 7 ? "warning" : undefined,
    });
  }

  for (const item of student.interviewStatus) {
    events.push({
      id: `tl-sel-${item.company}-${item.updatedAt}`,
      studentId: student.id,
      type: "selection",
      title: `${item.company} — ${item.stage}`,
      description: "選考進捗の更新",
      occurredAt: item.updatedAt,
    });
  }

  const sortedHistory = [...temperatureHistory].sort(
    (a, b) =>
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );
  for (let i = 1; i < sortedHistory.length; i++) {
    const prev = sortedHistory[i - 1];
    const curr = sortedHistory[i];
    if (prev.temperature !== curr.temperature) {
      events.push({
        id: `tl-temp-${curr.recordedAt}`,
        studentId: student.id,
        type: "temperature",
        title: "温度感の変化",
        description: `${TEMPERATURE_LABELS[prev.temperature]} → ${TEMPERATURE_LABELS[curr.temperature]}`,
        occurredAt: curr.recordedAt,
        severity:
          curr.temperature === "at_risk" || curr.temperature === "low"
            ? "warning"
            : undefined,
      });
    }
  }

  for (const issue of computeFollowIssues(student)) {
    if (issue.severity !== "info") {
      events.push({
        id: `tl-follow-${issue.type}`,
        studentId: student.id,
        type: "follow",
        title: issue.title,
        description: issue.description,
        occurredAt: student.updatedAt,
        severity: issue.severity,
      });
    }
  }

  if (daysSince(student.createdAt) < 60) {
    events.push({
      id: `tl-created-${student.id}`,
      studentId: student.id,
      type: "status",
      title: "学生登録",
      description: `${student.university} · 担当 ${student.assignedCaName}`,
      occurredAt: student.createdAt,
    });
  }

  return events.sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );
}
