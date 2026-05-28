import { computeFollowIssues } from "@/lib/follow/alerts";
import type { AIAnalysis, Student } from "@/lib/data/types";

export function buildRecommendedAction(
  student: Student,
  analysis?: AIAnalysis | null
): string {
  const issues = computeFollowIssues(student);

  if (student.temperature === "at_risk" || student.unreadDays >= 10) {
    return "離脱リスクが高い状態です。代表またはCAから状況ヒアリングと次の面談日程の確保を推奨します。";
  }

  const contactIssue = issues.find((i) => i.type === "contact_stale");
  if (contactIssue) {
    return "7日以上返信がありません。LINEで近況確認と次回面談の候補日を送るフォローを推奨します。";
  }

  if (student.interviewCancelled) {
    return "面談キャンセル履歴があります。負担の少ない短時間フォローで関係を再構築することを推奨します。";
  }

  const memoIssue = issues.find((i) => i.type === "memo_stale");
  if (memoIssue) {
    return "カルテの更新が滞っています。直近のやり取りをメモに残し、次回アクションを設定してください。";
  }

  if (!student.nextAction?.trim()) {
    return "次回アクションが未設定です。面談・ES・選考のいずれかで具体的なタスクと期限を決めてください。";
  }

  if (student.status === "selecting") {
    return "選考中です。直近の面接振り返りと企業別の次ステップ確認を推奨します。";
  }

  if (analysis?.anxiety && analysis.anxiety.length > 0) {
    return `面接不安の可能性があります（${analysis.anxiety[0]}）。CAから軽いフォローと面接練習の提案を推奨します。`;
  }

  if (student.temperature === "low") {
    return "温度感が低下傾向です。志望動機の再確認と小さな成功体験づくりの面談を推奨します。";
  }

  return "定期的な近況確認と次回面談の設定を継続してください。";
}

export function formatLastContact(student: Student): string {
  if (student.unreadDays === 0) return "本日接触";
  if (student.unreadDays === 1) return "1日前";
  return `${student.unreadDays}日前`;
}
