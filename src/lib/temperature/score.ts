import type { Interview, Student, Temperature } from "@/lib/data/types";
import { daysSince } from "@/lib/follow/alerts";

const TEMP_RANK: Record<Temperature, number> = {
  high: 4,
  medium: 3,
  low: 2,
  at_risk: 1,
};

export function computeTemperatureScore(student: Student): number {
  let score = 50;
  if (student.unreadDays <= 2) score += 25;
  else if (student.unreadDays <= 6) score += 10;
  else score -= 20;

  if (student.lastInterviewAt) {
    const days = daysSince(student.lastInterviewAt);
    if (days <= 7) score += 15;
    else if (days <= 14) score += 5;
    else score -= 10;
  } else {
    score -= 15;
  }

  if (daysSince(student.lastMemoUpdatedAt) <= 7) score += 10;
  if (student.interviewDeclined || student.interviewCancelled) score -= 25;
  if (student.status === "paused" || student.status === "at_risk_status")
    score -= 20;
  if (student.status === "selecting" || student.status === "offer") score += 5;

  return Math.max(0, Math.min(100, score));
}

export function scoreToTemperature(score: number): Temperature {
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  if (score >= 25) return "low";
  return "at_risk";
}

export function hasTemperatureDropped(
  current: Temperature,
  history: { temperature: Temperature; recordedAt?: string }[]
): boolean {
  if (history.length < 2) return false;
  const sorted = [...history].sort((a, b) => {
    const ta = a.recordedAt ? new Date(a.recordedAt).getTime() : 0;
    const tb = b.recordedAt ? new Date(b.recordedAt).getTime() : 0;
    return ta - tb;
  });
  const prev = sorted[sorted.length - 2]?.temperature;
  if (!prev) return false;
  return TEMP_RANK[current] < TEMP_RANK[prev];
}

export function weeklyInterviewCount(
  studentId: string,
  interviews: Interview[]
): number {
  const weekAgo = Date.now() - 7 * 86400000;
  return interviews.filter(
    (i) =>
      i.studentId === studentId &&
      new Date(i.createdAt).getTime() >= weekAgo
  ).length;
}
