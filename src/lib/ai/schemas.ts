import { z } from "zod";

export const analysisResultSchema = z.object({
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
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export const memoAnalysisResultSchema = z.object({
  summary: z.string(),
  personality: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  orientation: z.string(),
  anxiety: z.array(z.string()),
  nextActions: z.array(z.string()),
  caRecommendedActions: z.array(z.string()),
  temperatureAnalysis: z.string(),
  temperatureScore: z.string(),
});

export type MemoAnalysisResult = z.infer<typeof memoAnalysisResultSchema>;
