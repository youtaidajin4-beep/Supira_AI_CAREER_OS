import { isDateToday } from "@/lib/utils/dates";
import { buildPriorityCards } from "@/lib/data/aggregates";
import type {
  AIAnalysis,
  Interview,
  PriorityStudentCard,
  Student,
} from "@/lib/data/types";

export interface CAHomeTodayStats {
  todayInterviews: number;
  needsFollowUp: number;
  missingNextAction: number;
  atRiskCount: number;
}

export interface CAHomeData {
  today: CAHomeTodayStats;
  priorityStudents: PriorityStudentCard[];
  students: Student[];
}

export function buildCAHomeTodayStats(
  students: Student[],
  interviews: Interview[]
): CAHomeTodayStats {
  const studentIds = new Set(students.map((s) => s.id));
  const todayInterviews = interviews.filter(
    (i) => studentIds.has(i.studentId) && isDateToday(i.createdAt)
  ).length;

  const needsFollowUp = students.filter(
    (s) => s.unreadDays >= 3 || s.temperature === "low"
  ).length;

  const missingNextAction = students.filter(
    (s) => !s.nextAction?.trim() || s.nextActionStatus === "pending"
  ).length;

  const atRiskCount = students.filter(
    (s) => s.temperature === "at_risk" || s.status === "at_risk_status"
  ).length;

  return {
    todayInterviews,
    needsFollowUp,
    missingNextAction,
    atRiskCount,
  };
}

export function buildCAHomeData(
  students: Student[],
  interviews: Interview[],
  analyses: Map<string, AIAnalysis>
): CAHomeData {
  const today = buildCAHomeTodayStats(students, interviews);
  const priorityStudents = buildPriorityCards(students, analyses, []).slice(
    0,
    5
  );

  return {
    today,
    priorityStudents,
    students: [...students].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ),
  };
}
