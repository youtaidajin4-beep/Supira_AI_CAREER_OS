export const SYSTEM_PROMPT = `あなたは新卒人材紹介のトップCA（キャリアアドバイザー）が毎日使う「面談解析AI」です。
面談の文字起こしから、CAが次の1週間で迷わず動けるレベルの深い分析を日本語で出力してください。

対象は新卒就活生。以下を必ず意識する:
- ガクチカの深さ、志望動機の一貫性、ES/選考の進捗、面接準備度
- 学生の「本音」が出ている発言を keyQuotes に拾う
- CAが読んでテンションが上がる wowInsight（意外な発見・勝ち筋）を書く
- 抽象論禁止。具体的な次アクションとLINE文面まで落とし込む

ルール:
- 敬体（です・ます）
- 学生を否定しない
- 「AI」「モデル」は使わない
- 全項目をJSONで返す（insights オブジェクト必須）`;

export function buildAnalysisUserPrompt(
  transcript: string,
  studentContext?: string
): string {
  return `以下の面談文字起こしを、新卒就活支援の観点で深く分析してください。

${studentContext ? `【学生コンテキスト】\n${studentContext}\n\n` : ""}【文字起こし】
${transcript}

【必須JSON構造】
{
  "summary": "面談要約（300〜400字。事実・感情・次の一手を含む）",
  "personality": "学生タイプを一言ラベル＋50字説明",
  "strengths": ["強み5つ（就活で売れる表現）"],
  "weaknesses": ["改善点3〜4つ"],
  "orientation": "志向性・価値観（100字以上）",
  "anxiety": ["不安・ブロッカー3〜5つ"],
  "nextActions": ["次回までの学生タスク4〜6つ"],
  "recommendedCompanies": ["推奨企業タイプ4〜5つ"],
  "caRecommendedActions": ["CAが今日〜今週やること3〜5つ"],
  "temperatureAnalysis": "温度感の根拠（150字以上）",
  "temperatureScore": "高|中|低|離脱リスク のいずれか1つ",
  "insights": {
    "sessionHeadline": "CAの目を引く見出し（25字以内・インパクト重視）",
    "wowInsight": "CAが『おっ！』と思う洞察（80〜120字。データや発言に基づく）",
    "energyLevel": "on_fire|steady|cooling|critical",
    "keyQuotes": [{"quote": "学生の生の言葉", "meaning": "CAが知るべき意味"}],
    "studentType": {"label": "タイプ名", "oneLiner": "50字", "traits": ["特徴4つ"]},
    "jobHuntSnapshot": {"phase": "就活フェーズ", "esStatus": "ES状況", "selectionStatus": "選考状況", "timelineNote": "スケジュール示唆"},
    "gakuchika": {"episode": "ガクチカ要約", "depthScore": 1-5, "sellPoints": ["訴求3つ"], "gapsToProbe": ["深掘り質問2〜3"]},
    "interviewReadiness": {"score": 0-100, "verdict": "判定コメント", "blockers": ["阻害要因"], "practiceTopics": ["練習テーマ4つ"]},
    "riskSignals": [{"signal": "リスク", "severity": "high|medium|low", "caAction": "CAの対処"}],
    "companyFit": {"bestTypes": ["相性良い企業タイプ"], "avoidTypes": ["ミスマッチ"], "reasoning": "理由80字以上"},
    "caPlaybook": {"doToday": ["今日やる2〜3"], "thisWeek": ["今週4〜5"], "lineDraft": "LINE送信用ドラフト（150字程度）", "nextMeetingAgenda": ["次回面談アジェンダ5つ"]}
  }
}`;
}

export const MEMO_SYSTEM_PROMPT = SYSTEM_PROMPT;

export function buildMemoAnalysisUserPrompt(
  memo: string,
  studentContext?: string
): string {
  return buildAnalysisUserPrompt(memo, studentContext).replace(
    "【文字起こし】",
    "【面談メモ】"
  );
}
