import { daysSince, followScore } from "@/lib/follow/alerts";
import {
  buildRecommendedAction,
  formatLastContact,
} from "@/lib/operations/recommended-actions";
import { classifyStudentLayer } from "@/lib/priority/layers";
import { hasTemperatureDropped } from "@/lib/temperature/score";
import { getTemperatureHistoryForStudent } from "@/lib/temperature/history";
import type {
  AIAnalysis,
  Alert,
  CAAttentionSummary,
  CAUser,
  CompanyUpdate,
  Interview,
  PriorityStudent,
  PriorityStudentCard,
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

export function buildPriorityCards(
  students: Student[],
  analyses: Map<string, AIAnalysis>,
  interventions: { relatedStudentId?: string }[]
): PriorityStudentCard[] {
  return buildPriorityStudents(students)
    .slice(0, 10)
    .map(({ student, score, reasons }) => {
      const history = getTemperatureHistoryForStudent(student);
      return {
        student,
        score,
        reasons,
        recommendedAction: buildRecommendedAction(
          student,
          analyses.get(student.id)
        ),
        lastContactLabel: formatLastContact(student),
        needsExecutiveAttention: interventions.some(
          (i) => i.relatedStudentId === student.id
        ),
        temperatureDroppedRecently: hasTemperatureDropped(
          student.temperature,
          history
        ),
        priorityLayer: classifyStudentLayer(student),
      };
    });
}

export function buildCAAttentionSummaries(
  cas: CAUser[],
  students: Student[],
  interviews: Interview[]
): CAAttentionSummary[] {
  return cas.map((ca) => {
    const mine = students.filter((s) => s.assignedCaId === ca.id);
    const mineInterviews = interviews.filter((i) =>
      mine.some((s) => s.id === i.studentId)
    );
    const staleInterviewCount = mine.filter(
      (s) => s.lastInterviewAt && daysSince(s.lastInterviewAt) >= 14
    ).length;
    const recentMemo = mine.filter(
      (s) => daysSince(s.lastMemoUpdatedAt) <= 7
    ).length;
    const interviewUpdateRate =
      mine.length > 0
        ? Math.round((recentMemo / mine.length) * 100)
        : 100;
    const delayedReplyCount = mine.filter((s) => s.unreadDays >= 7).length;
    const weeklyInterview = mineInterviews.filter((i) =>
      isWithinWeek(i.createdAt)
    ).length;

    const aiComment = buildCAComment(
      ca,
      delayedReplyCount,
      interviewUpdateRate,
      staleInterviewCount
    );

    return {
      ca,
      staleInterviewCount,
      interviewUpdateRate,
      delayedReplyCount,
      aiComment,
      weeklyInterviewCount: weeklyInterview,
      atRiskCount: mine.filter((s) => s.temperature === "at_risk").length,
      studentCount: mine.length,
      highTempCount: mine.filter((s) => s.temperature === "high").length,
    };
  });
}

function buildCAComment(
  ca: CAUser,
  delayedReply: number,
  updateRate: number,
  staleInterviews: number
): string {
  if (ca.performanceStatus === "needs_support" || delayedReply >= 3) {
    return `${ca.name}担当は返信遅延が${delayedReply}名あり、フォローリズムの見直しが必要です。代表からの声かけを検討してください。`;
  }
  if (updateRate < 60) {
    return `面談記録・メモ更新率が${updateRate}%と低めです。週次の更新ルール共有を推奨します。`;
  }
  if (staleInterviews >= 2) {
    return `面談から2週間以上経過した学生が${staleInterviews}名います。面談機会の確保をフォローしてください。`;
  }
  if (ca.riskStudentCount === 0 && ca.highTempCount >= 2) {
    return `${ca.name}担当は好調です。高温度感学生への内定獲得支援を加速できます。`;
  }
  return `${ca.name}担当は概ね安定しています。優先学生の次回アクション設定を継続してください。`;
}
