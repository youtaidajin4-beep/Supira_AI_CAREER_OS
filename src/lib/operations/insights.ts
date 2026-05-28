import type { CAUser, OperationInsight, Student } from "@/lib/data/types";

export function buildOperationInsights(
  students: Student[],
  cas: CAUser[]
): OperationInsight[] {
  const insights: OperationInsight[] = [];

  const atRiskRate =
    students.length > 0
      ? students.filter((s) => s.temperature === "at_risk").length /
        students.length
      : 0;

  if (atRiskRate > 0.15) {
    insights.push({
      id: "insight-at-risk",
      category: "離脱リスク",
      message: `担当学生の${Math.round(atRiskRate * 100)}%が離脱リスク圏内です。CA全体でのフォロー頻度見直しを検討してください。`,
      severity: "warning",
    });
  }

  const venture = students.filter(
    (s) =>
      s.industry.includes("IT") ||
      s.targetCompanies.some((c) =>
        ["メルカリ", "楽天", "サイバー"].some((v) => c.includes(v))
      )
  ).length;
  if (venture >= 5) {
    insights.push({
      id: "insight-venture",
      category: "志望傾向",
      message: "ベンチャー・IT志望の学生が増加傾向です。関連企業の説明会情報を優先共有すると効果的です。",
      severity: "info",
    });
  }

  const declined = students.filter((s) => s.interviewDeclined).length;
  if (declined >= 2) {
    insights.push({
      id: "insight-declined",
      category: "選考動向",
      message: "面接辞退・選考停止の学生が複数います。辞退理由のヒアリングとケア面談の検討を推奨します。",
      severity: "warning",
    });
  }

  const esWriting = students.filter((s) => s.status === "es_writing").length;
  if (esWriting >= 4) {
    insights.push({
      id: "insight-es",
      category: "工数",
      message: "ES作成中の学生が多く、添削工数が増加しています。テンプレート整備でCA負荷軽減を検討してください。",
      severity: "info",
    });
  }

  const highTempCas = cas.filter((c) => c.highTempCount >= 3);
  for (const ca of highTempCas.slice(0, 1)) {
    insights.push({
      id: `insight-ca-${ca.id}`,
      category: "CA状況",
      message: `${ca.name}担当の高温度感学生が多く、好調です。内定獲得に向けた企業紹介の加速が可能です。`,
      severity: "info",
    });
  }

  const needsSupport = cas.filter(
    (c) => c.performanceStatus === "needs_support"
  );
  if (needsSupport.length > 0) {
    insights.push({
      id: "insight-ca-support",
      category: "CA支援",
      message: `${needsSupport.map((c) => c.name).join("、")}のフォロー遅延が目立ちます。1on1または担当調整を検討してください。`,
      severity: "warning",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "insight-stable",
      category: "全体",
      message: "組織全体の温度感は概ね安定しています。未共有の企業連絡と優先学生のフォローを継続してください。",
      severity: "info",
    });
  }

  return insights.slice(0, 6);
}
