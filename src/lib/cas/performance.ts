import { daysSince } from "@/lib/follow/alerts";
import type {
  CAOperationsSummary,
  CAPerformanceMetrics,
  CAUser,
  Interview,
  Student,
  Temperature,
} from "@/lib/data/types";

const TEMP_RANK: Record<Temperature, number> = {
  high: 4,
  medium: 3,
  low: 2,
  at_risk: 1,
};

function avgTemperature(students: Student[]): Temperature {
  if (students.length === 0) return "medium";
  const avg =
    students.reduce((s, st) => s + TEMP_RANK[st.temperature], 0) /
    students.length;
  if (avg >= 3.5) return "high";
  if (avg >= 2.5) return "medium";
  if (avg >= 1.5) return "low";
  return "at_risk";
}

export function buildCAPerformanceMetrics(
  ca: CAUser,
  students: Student[],
  interviews: Interview[]
): CAPerformanceMetrics {
  const mine = students.filter((s) => s.assignedCaId === ca.id);
  const mineInterviews = interviews.filter((i) =>
    mine.some((s) => s.id === i.studentId)
  );
  const weekAgo = Date.now() - 7 * 86400000;
  const weeklyInterviewCount = mineInterviews.filter(
    (i) => new Date(i.createdAt).getTime() >= weekAgo
  ).length;
  const recentMemo = mine.filter(
    (s) => daysSince(s.lastMemoUpdatedAt) <= 7
  ).length;
  const memoUpdateRate =
    mine.length > 0 ? Math.round((recentMemo / mine.length) * 100) : 100;
  const unresponsiveCount = mine.filter((s) => s.unreadDays >= 7).length;

  const aiComment = buildCAPerformanceComment(
    ca,
    memoUpdateRate,
    unresponsiveCount,
    weeklyInterviewCount
  );

  return {
    ca,
    studentCount: mine.length,
    atRiskCount: mine.filter((s) => s.temperature === "at_risk").length,
    weeklyInterviewCount,
    memoUpdateRate,
    lastActivityAt: ca.lastActivityAt,
    unresponsiveCount,
    avgTemperature: avgTemperature(mine),
    selectingCount: mine.filter((s) => s.status === "selecting").length,
    offerCount: mine.filter(
      (s) => s.status === "offer" || s.status === "placed"
    ).length,
    aiComment,
  };
}

function buildCAPerformanceComment(
  ca: CAUser,
  memoRate: number,
  unresponsive: number,
  weeklyInterviews: number
): string {
  if (ca.performanceStatus === "needs_support" || unresponsive >= 3) {
    return "担当学生数が多く、返信遅延が起きやすい状態です。福与さんの声かけを検討してください。";
  }
  if (memoRate < 60) {
    return "面談記録の更新率が低いため、学生状況の把握が難しくなっています。";
  }
  if (ca.highTempCount >= 3) {
    return "温度感が高い学生が多く、企業紹介を前倒しできる可能性があります。";
  }
  if (ca.riskStudentCount >= 2) {
    return "離脱リスク学生が増えているため、福与さんの介入を推奨します。";
  }
  if (weeklyInterviews < 2) {
    return "今週の面談数が少なめです。面談機会の確保をフォローしてください。";
  }
  return "担当学生のフォローは概ね安定しています。";
}

export function enrichCAWithPerformance(
  ca: CAUser,
  metrics: CAPerformanceMetrics
): CAUser {
  return {
    ...ca,
    memoUpdateRate: metrics.memoUpdateRate,
    unresponsiveCount: metrics.unresponsiveCount,
    selectingCount: metrics.selectingCount,
    offerCount: metrics.offerCount,
    aiComment: metrics.aiComment,
  };
}

export function buildCAOperationsSummary(cas: CAUser[]): CAOperationsSummary {
  return {
    needsSupport: cas.filter((c) => c.performanceStatus === "needs_support"),
    performing: cas.filter(
      (c) =>
        c.performanceStatus === "excellent" ||
        (c.performanceStatus === "good" && c.highTempCount >= 2)
    ),
    stale: cas.filter((c) => {
      const days = daysSince(c.lastActivityAt);
      return days >= 5 || (c.memoUpdateRate ?? 100) < 50;
    }),
  };
}

export function classifyCARiskStudents(students: Student[]): {
  critical: Student[];
  attention: Student[];
} {
  const critical = students.filter(
    (s) =>
      s.temperature === "at_risk" ||
      s.unreadDays >= 10 ||
      (s.status === "selecting" && s.unreadDays >= 7)
  );
  const attention = students.filter(
    (s) =>
      !critical.includes(s) &&
      (s.temperature === "low" ||
        s.unreadDays >= 5 ||
        !s.nextAction?.trim() ||
        daysSince(s.lastMemoUpdatedAt) >= 7)
  );
  return { critical, attention };
}
