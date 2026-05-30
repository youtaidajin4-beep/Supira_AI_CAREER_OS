import type { CreateAnalysisInput } from "@/lib/data/types";
import type { AnalysisResult } from "./schemas";

export function mapAnalysisResultToCreateInput(
  result: AnalysisResult,
  studentId: string,
  options?: { interviewId?: string; source?: "audio" | "memo" }
): CreateAnalysisInput {
  return {
    studentId,
    interviewId: options?.interviewId,
    source: options?.source,
    summary: result.summary,
    personality: result.personality,
    strengths: result.strengths,
    weaknesses: result.weaknesses,
    orientation: result.orientation,
    anxiety: result.anxiety,
    nextActions: result.nextActions,
    recommendedCompanies: result.recommendedCompanies ?? [],
    caRecommendedActions:
      result.caRecommendedActions ?? result.insights.caPlaybook.doToday,
    temperatureAnalysis: result.temperatureAnalysis,
    temperatureScore: result.temperatureScore,
    insights: result.insights,
    executiveNotes: result.insights.wowInsight,
  };
}
