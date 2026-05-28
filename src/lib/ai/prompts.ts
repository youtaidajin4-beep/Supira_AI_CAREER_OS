export const SYSTEM_PROMPT = `あなたは新卒人材紹介会社のベテランキャリアアドバイザー（CA）のアシスタントです。
面談の文字起こしを読み、CAが次の面談や支援に使える実務的な分析を日本語で出力してください。

ルール:
- 敬体（です・ます）で書く
- 断定しすぎず、観察と提案のバランスを保つ
- 箇条書きを適宜使い、読みやすく整理する
- 学生の人格を否定しない
- 「AI」や「モデル」などの言葉は使わない`;

export function buildAnalysisUserPrompt(
  transcript: string,
  studentContext?: string
): string {
  return `以下の面談文字起こしを分析してください。

${studentContext ? `【学生コンテキスト】\n${studentContext}\n\n` : ""}【文字起こし】
${transcript}

以下の項目をJSON形式で出力してください:
- summary: 要約（200字程度）
- personality: 学生特徴
- strengths: 強み（配列、3〜5項目）
- weaknesses: 弱み・改善点（配列、2〜4項目）
- orientation: 志向性
- anxiety: 不安点（配列）
- nextActions: 次回聞くべきこと・CAのアクション（配列）
- recommendedCompanies: おすすめ企業タイプ（配列）
- temperatureAnalysis: 温度感分析（文章）
- temperatureScore: 温度感スコア（高/中/低/離脱リスク のいずれか）`;
}

export const MEMO_SYSTEM_PROMPT = `あなたは新卒人材紹介会社のベテランキャリアアドバイザー（CA）のアシスタントです。
CAが面談後に書いたメモを読み、CAが次の面談や支援に使える実務的な分析を日本語で出力してください。

ルール:
- 敬体（です・ます）で書く
- 断定しすぎず、観察と提案のバランスを保つ
- 箇条書きを適宜使い、読みやすく整理する
- 学生の人格を否定しない
- 「AI」や「モデル」などの言葉は使わない`;

export function buildMemoAnalysisUserPrompt(
  memo: string,
  studentContext?: string
): string {
  return `以下の面談メモを分析してください。

${studentContext ? `【学生コンテキスト】\n${studentContext}\n\n` : ""}【面談メモ】
${memo}

以下の項目をJSON形式で出力してください:
- summary: 面談要約（200字程度）
- personality: 学生特徴（短文）
- strengths: 学生の強み（配列、3〜5項目）
- weaknesses: 学生の弱み・改善点（配列、2〜4項目）
- orientation: 志向性
- anxiety: 不安点（配列）
- nextActions: 次回聞くべきこと（配列）
- caRecommendedActions: CAへの推奨アクション（配列、2〜4項目）
- temperatureAnalysis: 温度感分析（文章）
- temperatureScore: 温度感（「高」「中」「低」「離脱リスク」のいずれか1つ）`;
}

