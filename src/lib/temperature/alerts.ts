import type { Notification, Student } from "@/lib/data/types";

export interface TemperatureAlert {
  id: string;
  type: "alert";
  title: string;
  message: string;
  studentId: string;
}

export function getStudentAlerts(student: Student): TemperatureAlert[] {
  const alerts: TemperatureAlert[] = [];

  if (student.unreadDays >= 7) {
    alerts.push({
      id: `alert-unread-${student.id}`,
      type: "alert",
      title: "7日未返信",
      message: `${student.name}さんが${student.unreadDays}日間返信がありません。`,
      studentId: student.id,
    });
  }

  if (student.interviewCancelled) {
    alerts.push({
      id: `alert-cancel-${student.id}`,
      type: "alert",
      title: "面談キャンセル",
      message: `${student.name}さんが面談をキャンセルしました。`,
      studentId: student.id,
    });
  }

  if (student.temperature === "at_risk" && student.status === "paused") {
    alerts.push({
      id: `alert-risk-${student.id}`,
      type: "alert",
      title: "選考停止リスク",
      message: `${student.name}さんは離脱リスクかつ休止ステータスです。`,
      studentId: student.id,
    });
  }

  return alerts;
}

export function mergeAlertsWithNotifications(
  students: Student[],
  notifications: Notification[]
): Array<Notification | TemperatureAlert> {
  const dynamicAlerts = students.flatMap(getStudentAlerts);
  const seen = new Set(notifications.map((n) => `${n.title}-${n.studentId}`));

  const uniqueDynamic = dynamicAlerts.filter(
    (a) => !seen.has(`${a.title}-${a.studentId}`)
  );

  return [
    ...notifications,
    ...uniqueDynamic.map((a) => ({
      ...a,
      read: false,
      createdAt: new Date().toISOString(),
    })),
  ].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
