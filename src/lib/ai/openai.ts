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

export const MOCK_TRANSCRIPT = `【面談記録】
CA: 今日はケース面接の振り返りからいきましょう。前回の宿題、志望企業3社の「なぜこの会社か」は書けましたか？

学生: はい、A社とB社は書け終わって、C社はまだです。正直、C社は第2志望なんですけど、説明がうまくまとまらなくて…。

CA: なるほど。A社の志望理由、一番刺さったエピソードはどれですか？

学生: サークルのイベント企画です。200人規模で予算交渉とスポンサー獲得を任されて、当初は断られ続けたんですけど、企業ごとに提案資料を変えたら2社と契約できました。数字で言うと予算達成率130%で、後輩からも「再現できる？」って聞かれるくらいにはなりました。

CA: いいですね。一方で、面接本番ではまだ緊張して早口になると言っていましたね。

学生: そうなんです…。模擬面接だと頭の中で整理できるのに、本番だと「志望動機は—」って始めた瞬間に、ガクチカの話と混ざってしまって。先週のDeNAの1次で、志望動機の途中でESのエピソードを重複させてしまいました。

CA: それは改善ポイントが明確です。次回までに、志望動機は「結論→理由3つ→ガクチカ1つ→将来像」で60秒に固定しましょう。あと、C社は第2志望でも選考に進むなら、A社と差別化した軸が必要です。

学生: わかりました。C社は「事業開発に近い裁量」が魅力なので、サークルでの0→1経験を前面に出すと良さそうですか？

CA: その方向でOK。今日のLINEで、60秒版の志望動機ドラフトを送ってください。次回は模擬面接を録画して一緒に直します。`;

export const MOCK_ANALYSIS: AnalysisResult = {
  summary:
    "志望企業A・BのESは完了、C社は軸の言語化が未完了。サークルイベント企画（予算130%達成・スポンサー2社獲得）が核となるガクチカとして成熟しており、数値と再現性の訴求が可能。一方、本番面接では志望動機とガクチカの話が混線し、DeNA 1次でも同様の課題が発生。次回までに60秒構成の志望動機固定と、C社向け差別化軸の明確化が急務。学生の意欲は高く、具体的なフィードバックを求める姿勢が強み。",
  personality: "実行力型ドライバー — 数字で成果を出すが、本番のストーリー設計に課題",
  strengths: [
    "200人規模イベントの予算・スポンサー交渉で130%達成",
    "失敗後のPDCA（提案資料のカスタマイズ）が再現可能",
    "フィードバックを即実行する行動力",
    "第2志望でも差別化軸を自分で提案できる柔軟性",
    "志望企業へのリサーチ量が多い",
  ],
  weaknesses: [
    "本番面接での志望動機とガクチカの混線",
    "緊張時の早口・構成崩れ",
    "第2志望企業（C社）の志望理由が未整理",
  ],
  orientation:
    "0→1で裁量を持てる事業開発・新規事業寄りの環境を志向。安定より成長と学習曲線を重視し、インターンでは「任された範囲を広げた」経験に価値を置いている。",
  anxiety: [
    "志望動機の冒頭で頭が真っ白になる",
    "他の学生と比較してガクチカが弱いと感じる",
    "第2志望の企業を軽く見られないか",
  ],
  nextActions: [
    "A社・B社志望理由の最終推敲",
    "C社志望理由（事業開発裁量×0→1経験）を今夜までにドラフト",
    "志望動機60秒版をLINEで送付",
    "模擬面接の録画提出",
    "DeNA 2次に向けた逆質問リスト作成",
  ],
  recommendedCompanies: [
    "事業開発・新規事業に強いメガベンチャー",
    "裁量の大きい成長期スタートアップ",
    "若手登用のコンサル（戦略×実行）",
    "学生の0→1経験を評価するメーカー新事業室",
  ],
  caRecommendedActions: [
    "60秒志望動機の添削を24時間以内に返す",
    "C社の事業開発職の内定者記事を共有",
    "模擬面接の日程を今週中に確定",
  ],
  temperatureAnalysis:
    "面談参加・宿題進捗ともに良好。失敗（DeNA 1次）を隠さず共有しており、信頼関係は強い。C社軸の言語化ができれば選考通過率は上がる見込み。",
  temperatureScore: "高",
  insights: {
    sessionHeadline: "ガクチカは「勝てる」。本番で「混ぜない」だけ",
    wowInsight:
      "第2志望のC社を「まだ書けていない」と言いながら、口頭では事業開発×0→1の差別化軸まで自分で組み立てられた。能力不足ではなく「言語化の型」がないだけ — 60秒テンプレを渡せば一気に通る学生です。",
    energyLevel: "on_fire",
    keyQuotes: [
      {
        quote: "「模擬だと整理できるのに、本番だとガクチカと混ざる」",
        meaning: "準備不足ではなく構成スキルの問題。型を渡せば改善見込み大",
      },
      {
        quote: "「予算達成率130%、後輩に再現方法を聞かれる」",
        meaning: "リーダーシップと再現性の両方を訴求できる希少ガクチカ",
      },
      {
        quote: "「C社は事業開発の裁量が魅力」",
        meaning: "第2志望でも軸はある。ES化すれば選考継続可能",
      },
    ],
    studentType: {
      label: "実行力型ドライバー",
      oneLiner: "数字で成果を出し、改善を回せる。本番の演出設計が最後の壁。",
      traits: [
        "交渉・企画の実行力",
        "数値での成果訴求",
        "FB即反映",
        "複数社並走の自己管理",
      ],
    },
    jobHuntSnapshot: {
      phase: "本選考突入期（1次〜2次）",
      esStatus: "A・B社完了 / C社ドラフト未",
      selectionStatus: "DeNA 1次通過・2次準備中 / 他社並行",
      timelineNote: "今週中にC社ESと60秒志望動機を仕上げれば、来週の模擬面接が本番の勝負どころ",
    },
    gakuchika: {
      episode:
        "200人規模サークルイベントの予算・スポンサー交渉。断られ続けた後、企業別提案資料で2社契約・予算130%達成。",
      depthScore: 4,
      sellPoints: [
        "130%予算達成の数値インパクト",
        "PDCAの再現性（後輩から手法を聞かれる）",
        "交渉・企画の両輪",
      ],
      gapsToProbe: [
        "チーム内の対立はあったか？どう解決したか",
        "なぜ130%を目指したか（意思決定の背景）",
        "DeNA志望とこのエピソードの接続",
      ],
    },
    interviewReadiness: {
      score: 68,
      verdict: "内容は十分通るレベル。本番の「型」と「時間」が課題。",
      blockers: [
        "志望動機とガクチカの混線",
        "緊張による早口",
        "60秒で言い切る訓練不足",
      ],
      practiceTopics: [
        "志望動機60秒（結論→理由3→ガクチカ1→将来）",
        "DeNA 2次の逆質問",
        "C社向け志望理由の差別化",
        "録画レビューでのフィラー除去",
      ],
    },
    riskSignals: [
      {
        signal: "本番でストーリーが混線し、志望動機が伝わらない",
        severity: "high",
        caAction: "60秒テンプレをLINEで送り、24h以内に音声提出を依頼",
      },
      {
        signal: "C社を第2志望扱いし、ES遅延",
        severity: "medium",
        caAction: "C社を「勝ち筋ありの第2」として今夜ドラフト必須に設定",
      },
      {
        signal: "他学生比較による自信低下",
        severity: "low",
        caAction: "ガクチカの数値優位性を面談で再確認する",
      },
    ],
    companyFit: {
      bestTypes: [
        "事業開発・新規事業",
        "メガベンチャー（裁量大）",
        "コンサル（戦略×実行）",
      ],
      avoidTypes: ["超安定型・ルーティン業務中心の大手総合職"],
      reasoning:
        "0→1と交渉の両方を評価する文化と相性が良い。定型業務のみの環境はモチベーション低下リスク。",
    },
    caPlaybook: {
      doToday: [
        "60秒志望動機テンプレをLINE送信",
        "C社事業開発の内定者記事1本共有",
        "DeNA 2次の逆質問例を3つ送る",
      ],
      thisWeek: [
        "模擬面接（録画）を60分実施",
        "C社志望理由ドラフト添削",
        "A・B社ESの最終チェック",
        "次回面談アジェンダの事前共有",
      ],
      lineDraft:
        "本日お疲れさまでした！サークルイベントのエピソード、予算130%は本当に強いです💪 本番で話が混ざるのは「型」がないだけなので、今夜お送りする60秒テンプレで志望動機を一度録音して送ってください。C社の軸も一緒に仕上げましょう！",
      nextMeetingAgenda: [
        "60秒志望動機の録画フィードバック",
        "DeNA 2次模擬面接",
        "C社志望理由の最終化",
        "逆質問のブラッシュアップ",
        "来週の選考スケジュール確認",
      ],
    },
  },
};

export const MOCK_MEMO_ANALYSIS: MemoAnalysisResult = {
  ...MOCK_ANALYSIS,
  recommendedCompanies: MOCK_ANALYSIS.recommendedCompanies,
};

export async function transcribeAudio(file: File): Promise<string> {
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
    temperature: 0.45,
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
    temperature: 0.45,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");

  const parsed = JSON.parse(content) as unknown;
  const result = memoAnalysisResultSchema.parse(parsed);
  return {
    ...result,
    recommendedCompanies:
      result.recommendedCompanies ?? result.insights.companyFit.bestTypes,
  };
}
