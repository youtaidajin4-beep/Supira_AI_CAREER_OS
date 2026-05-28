import OpenAI from "openai";
import {
  analysisResultSchema,
  memoAnalysisResultSchema,
  type AnalysisResult,
  type MemoAnalysisResult,
} from "./schemas";
import {
  SYSTEM_PROMPT,
  MEMO_SYSTEM_PROMPT,
  buildAnalysisUserPrompt,
  buildMemoAnalysisUserPrompt,
} from "./prompts";

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export function shouldUseMockAI(): boolean {
  return (
    process.env.DEV_MOCK_AI === "true" || !process.env.OPENAI_API_KEY
  );
}

export const MOCK_TRANSCRIPT =
  "本日の面談では、学生の志望業界と選考状況について話し合いました。学生は前向きな姿勢を見せていましたが、面接対策への不安も吐露していました。次回は模擬面接を実施する予定です。";

export const MOCK_ANALYSIS: AnalysisResult = {
  summary:
    "学生は選考に前向きな姿勢を示しています。面接対策への不安があり、具体的な練習計画の設定が有効と考えられます。",
  personality: "真面目で誠実、準備を重視するタイプ",
  strengths: ["コミュニケーション意欲", "フィードバックへの前向きさ"],
  weaknesses: ["面接での緊張", "自己PRの構造化不足"],
  orientation: "成長できる環境を重視。業界への理解を深めたい意向。",
  anxiety: ["面接での失敗", "他の学生との比較"],
  nextActions: [
    "模擬面接の日程調整",
    "志望企業の深掘り質問リスト作成",
    "自己PRの骨子レビュー",
  ],
  recommendedCompanies: [
    "研修制度が充実した大手",
    "若手が活躍できる成長企業",
  ],
  temperatureAnalysis:
    "面談参加は良好。継続的なフォローで温度感は維持できそうです。",
  temperatureScore: "中",
  caRecommendedActions: [
    "次回面談で模擬面接のフィードバックを実施",
    "志望企業リストの優先順位を一緒に整理",
  ],
};

export const MOCK_MEMO_ANALYSIS: MemoAnalysisResult = {
  summary:
    "面談では選考への意欲と不安が同居している様子がうかがえます。具体的な次のアクションを設定することで、学生の行動を後押しできそうです。",
  personality: "真面目で準備を重視するタイプ",
  strengths: ["フィードバックへの前向きさ", "自己分析の意欲"],
  weaknesses: ["面接での緊張", "優先順位付けの迷い"],
  orientation: "成長環境と安定性のバランスを重視",
  anxiety: ["面接での失敗", "他の学生との比較"],
  nextActions: [
    "志望理由の深掘り質問を準備",
    "次回までのToDoを3つに絞って合意",
  ],
  caRecommendedActions: [
    "模擬面接の日程を早めに設定",
    "内定者または先輩CAの話を聞く機会を用意",
  ],
  temperatureAnalysis:
    "面談参加は良好。継続的なフォローで温度感は維持できそうです。",
  temperatureScore: "中",
};

export async function transcribeAudio(
  file: File
): Promise<string> {
  const client = getOpenAIClient();
  if (!client) return MOCK_TRANSCRIPT;

  const transcription = await client.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language: "ja",
  });

  return transcription.text;
}

export async function analyzeTranscript(
  transcript: string,
  studentContext?: string
): Promise<AnalysisResult> {
  if (shouldUseMockAI()) {
    return { ...MOCK_ANALYSIS, summary: MOCK_ANALYSIS.summary };
  }

  const client = getOpenAIClient();
  if (!client) return MOCK_ANALYSIS;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: buildAnalysisUserPrompt(transcript, studentContext),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");

  const parsed = JSON.parse(content) as unknown;
  return analysisResultSchema.parse(parsed);
}

export async function analyzeMemo(
  memo: string,
  studentContext?: string
): Promise<MemoAnalysisResult> {
  if (shouldUseMockAI()) {
    return { ...MOCK_MEMO_ANALYSIS };
  }

  const client = getOpenAIClient();
  if (!client) return { ...MOCK_MEMO_ANALYSIS };

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: MEMO_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildMemoAnalysisUserPrompt(memo, studentContext),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");

  const parsed = JSON.parse(content) as unknown;
  return memoAnalysisResultSchema.parse(parsed);
}
