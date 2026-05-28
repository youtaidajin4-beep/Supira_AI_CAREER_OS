import { followScore } from "@/lib/follow/alerts";
import type {
  Alert,
  CAUser,
  CompanyUpdate,
  Interview,
  PriorityStudent,
  Student,
} from "./types";

const WEEK_MS = 7 * 86400000;

export function isWithinWeek(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() <= WEEK_MS;
}

export function enrichCAStats(
  ca: CAUser,
  students: Student[],
  interviews: Interview[],
  alerts: Alert[]
): CAUser {
  const mine = students.filter((s) => s.assignedCaId === ca.id);
  const weeklyInterviews = interviews.filter(
    (i) =>
      mine.some((s) => s.id === i.studentId) && isWithinWeek(i.createdAt)
  ).length;
  const openAlerts = alerts.filter(
    (a) => a.relatedCaId === ca.id && !a.resolved
  ).length;

  return {
    ...ca,
    studentCount: mine.length,
    riskStudentCount: mine.filter((s) => s.temperature === "at_risk").length,
    highTempCount: mine.filter((s) => s.temperature === "high").length,
    weeklyInterviewCount: weeklyInterviews,
    openAlertCount: openAlerts,
    lastActivityAt:
      mine.length > 0
        ? mine.reduce((latest, s) =>
            new Date(s.updatedAt) > new Date(latest) ? s.updatedAt : latest
          , mine[0].updatedAt)
        : ca.lastActivityAt,
  };
}

export function buildPriorityStudents(students: Student[]): PriorityStudent[] {
  return students
    .map((student) => ({
      student,
      score: followScore(student),
      reasons: computeFollowReasons(student),
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);
}

function computeFollowReasons(student: Student): string[] {
  const reasons: string[] = [];
  if (student.temperature === "at_risk") reasons.push("離脱リスク");
  if (student.unreadDays >= 7) reasons.push(`${student.unreadDays}日未返信`);
  if (!student.nextAction?.trim()) reasons.push("次回アクション未設定");
  if (student.status === "selecting") reasons.push("選考中");
  return reasons;
}

export function countUnresponsive(students: Student[]): number {
  return students.filter((s) => s.unreadDays >= 7).length;
}

export function countSelecting(students: Student[]): number {
  return students.filter((s) => s.status === "selecting").length;
}

export function countOffers(students: Student[]): number {
  return students.filter(
    (s) => s.status === "offer" || s.status === "placed"
  ).length;
}

export function pendingCompanyUpdates(updates: CompanyUpdate[]): CompanyUpdate[] {
  return updates.filter((u) => u.shareStatus === "unshared");
}
