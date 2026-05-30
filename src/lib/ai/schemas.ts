import { z } from "zod";

export const interviewInsightsSchema = z.object({
  sessionHeadline: z.string(),
  wowInsight: z.string(),
  energyLevel: z.enum(["on_fire", "steady", "cooling", "critical"]),
  keyQuotes: z
    .array(
      z.object({
        quote: z.string(),
        meaning: z.string(),
      })
    )
    .min(1)
    .max(4),
  studentType: z.object({
    label: z.string(),
    oneLiner: z.string(),
    traits: z.array(z.string()).min(2).max(6),
  }),
  jobHuntSnapshot: z.object({
    phase: z.string(),
    esStatus: z.string(),
    selectionStatus: z.string(),
    timelineNote: z.string(),
  }),
  gakuchika: z.object({
    episode: z.string(),
    depthScore: z.number().min(1).max(5),
    sellPoints: z.array(z.string()).min(2).max(5),
    gapsToProbe: z.array(z.string()).min(1).max(4),
  }),
  interviewReadiness: z.object({
    score: z.number().min(0).max(100),
    verdict: z.string(),
    blockers: z.array(z.string()).min(1).max(5),
    practiceTopics: z.array(z.string()).min(2).max(6),
  }),
  riskSignals: z
    .array(
      z.object({
        signal: z.string(),
        severity: z.enum(["high", "medium", "low"]),
        caAction: z.string(),
      })
    )
    .min(1)
    .max(5),
  companyFit: z.object({
    bestTypes: z.array(z.string()).min(2).max(5),
    avoidTypes: z.array(z.string()).max(3),
    reasoning: z.string(),
  }),
  caPlaybook: z.object({
    doToday: z.array(z.string()).min(2).max(4),
    thisWeek: z.array(z.string()).min(2).max(5),
    lineDraft: z.string(),
    nextMeetingAgenda: z.array(z.string()).min(3).max(6),
  }),
});

export type InterviewInsightsPayload = z.infer<typeof interviewInsightsSchema>;

const analysisCoreSchema = z.object({
  summary: z.string(),
  personality: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  orientation: z.string(),
  anxiety: z.array(z.string()),
  nextActions: z.array(z.string()),
  recommendedCompanies: z.array(z.string()),
  caRecommendedActions: z.array(z.string()).optional(),
  temperatureAnalysis: z.string(),
  temperatureScore: z.string(),
  insights: interviewInsightsSchema,
});

export const analysisResultSchema = analysisCoreSchema;

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export const memoAnalysisResultSchema = analysisCoreSchema.omit({
  recommendedCompanies: true,
}).extend({
  recommendedCompanies: z.array(z.string()).optional(),
});

export type MemoAnalysisResult = z.infer<typeof memoAnalysisResultSchema>;
