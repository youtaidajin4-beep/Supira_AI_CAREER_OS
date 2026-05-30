import type { AIAnalysis, Student } from "@/lib/data/types";

export type InterviewEnergyLevel = "on_fire" | "steady" | "cooling" | "critical";

export interface InterviewKeyQuote {
  quote: string;
  meaning: string;
}

export interface InterviewRiskSignal {
  signal: string;
  severity: "high" | "medium" | "low";
  caAction: string;
}

export interface InterviewAnalysisInsights {
  sessionHeadline: string;
  wowInsight: string;
  energyLevel: InterviewEnergyLevel;
  keyQuotes: InterviewKeyQuote[];
  studentType: {
    label: string;
    oneLiner: string;
    traits: string[];
  };
  jobHuntSnapshot: {
    phase: string;
    esStatus: string;
    selectionStatus: string;
    timelineNote: string;
  };
  gakuchika: {
    episode: string;
    depthScore: number;
    sellPoints: string[];
    gapsToProbe: string[];
  };
  interviewReadiness: {
    score: number;
    verdict: string;
    blockers: string[];
    practiceTopics: string[];
  };
  riskSignals: InterviewRiskSignal[];
  companyFit: {
    bestTypes: string[];
    avoidTypes: string[];
    reasoning: string;
  };
  caPlaybook: {
    doToday: string[];
    thisWeek: string[];
    lineDraft: string;
    nextMeetingAgenda: string[];
  };
}

export const ENERGY_META: Record<
  InterviewEnergyLevel,
  { label: string; emoji: string; className: string }
> = {
  on_fire: {
    label: "熱量MAX",
    emoji: "🔥",
    className: "bg-orange-500/15 text-orange-700 ring-orange-500/30",
  },
  steady: {
    label: "安定推移",
    emoji: "📈",
    className: "bg-success-subtle text-success ring-success/30",
  },
  cooling: {
    label: "温度低下注意",
    emoji: "🌡️",
    className: "bg-warning-subtle text-warning ring-warning/30",
  },
  critical: {
    label: "要緊急フォロー",
    emoji: "🚨",
    className: "bg-danger-subtle text-danger ring-danger/30",
  },
};

function scoreFromTemperature(temperatureScore: string): number {
  const t = temperatureScore.toLowerCase();
  if (t.includes("高")) return 82;
  if (t.includes("離脱") || t.includes("リスク")) return 28;
  if (t.includes("低")) return 45;
  return 62;
}

function energyFromScore(score: string): InterviewEnergyLevel {
  const t = score.toLowerCase();
  if (t.includes("高")) return "on_fire";
  if (t.includes("離脱") || t.includes("リスク")) return "critical";
  if (t.includes("低")) return "cooling";
  return "steady";
}

/** 旧データ向け：基本フィールドから表示用インサイトを補完 */
export function resolveInterviewInsights(
  analysis: AIAnalysis,
  student?: Student | null
): InterviewAnalysisInsights {
  if (analysis.insights) return analysis.insights;

  const energy = energyFromScore(analysis.temperatureScore);
  const readiness = scoreFromTemperature(analysis.temperatureScore);
  const name = student?.name ?? "この学生";

  return {
    sessionHeadline: `${name}さん — 次の一手が見えた面談`,
    wowInsight:
      analysis.executiveNotes ??
      `${analysis.personality}。${analysis.orientation.slice(0, 80)}…`,
    energyLevel: energy,
    keyQuotes: [
      {
        quote: "「自分の強みをもっと言語化したい」",
        meaning: "自己理解欲求が高く、深掘りに乗りやすいタイミング",
      },
    ],
    studentType: {
      label: analysis.personality.split(/[、・]/)[0] ?? "分析型",
      oneLiner: analysis.personality,
      traits: analysis.strengths.slice(0, 4),
    },
    jobHuntSnapshot: {
      phase: student?.status ? mapStatusPhase(student.status) : "選考準備期",
      esStatus: student?.esMemo ? "ES進行あり" : "ES要確認",
      selectionStatus:
        student?.interviewStatus?.length
          ? `${student.interviewStatus.length}社選考中`
          : "選考未開始または情報不足",
      timelineNote: analysis.temperatureAnalysis,
    },
    gakuchika: {
      episode: analysis.summary,
      depthScore: Math.min(5, Math.max(2, Math.round(readiness / 22))),
      sellPoints: analysis.strengths,
      gapsToProbe: analysis.weaknesses,
    },
    interviewReadiness: {
      score: readiness,
      verdict: analysis.temperatureAnalysis,
      blockers: analysis.anxiety,
      practiceTopics: analysis.nextActions,
    },
    riskSignals: analysis.anxiety.map((a, i) => ({
      signal: a,
      severity: (i === 0 ? "high" : "medium") as InterviewRiskSignal["severity"],
      caAction: analysis.caRecommendedActions?.[i] ?? analysis.nextActions[i] ?? "次回面談で確認",
    })),
    companyFit: {
      bestTypes: analysis.recommendedCompanies,
      avoidTypes: [],
      reasoning: analysis.orientation,
    },
    caPlaybook: {
      doToday: (analysis.caRecommendedActions ?? analysis.nextActions).slice(0, 2),
      thisWeek: analysis.nextActions,
      lineDraft: `お疲れさまでした！本日の面談、${analysis.summary.slice(0, 40)}… 次回は「${analysis.nextActions[0] ?? "フォロー"}」から進めましょう💪`,
      nextMeetingAgenda: analysis.nextActions,
    },
  };
}

function mapStatusPhase(status: Student["status"]): string {
  const map: Record<Student["status"], string> = {
    before_interview: "初回面談前",
    self_analysis: "自己分析期",
    es_writing: "ES作成期",
    introducing: "企業紹介期",
    selecting: "本選考期",
    offer: "内定保有",
    at_risk_status: "離脱リスク",
    paused: "一時停止",
    placed: "内定承諾",
  };
  return map[status] ?? "就活進行中";
}
