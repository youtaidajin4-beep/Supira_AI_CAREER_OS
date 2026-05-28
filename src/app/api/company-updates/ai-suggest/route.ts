import { NextRequest, NextResponse } from "next/server";
import { getRepository } from "@/lib/data/get-repository";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const repo = getRepository();
  const [cas, students] = await Promise.all([
    repo.listCAs(),
    repo.listStudents(),
  ]);

  const relatedCaIds: string[] = body.relatedCaIds ?? [];
  const relatedStudentIds: string[] = body.relatedStudentIds ?? [];
  const content = String(body.content ?? "");
  const companyName = String(body.companyName ?? "企業");

  const suggestedCas =
    relatedCaIds.length > 0
      ? cas.filter((c) => relatedCaIds.includes(c.id))
      : cas.slice(0, 2);

  const suggestedStudents =
    relatedStudentIds.length > 0
      ? students.filter((s) => relatedStudentIds.includes(s.id))
      : students.filter((s) => s.status === "selecting").slice(0, 3);

  const summary = `【${companyName}】${String(body.title ?? "連絡")}：${content.slice(0, 120)}${content.length > 120 ? "…" : ""}`;
  const caNames = suggestedCas.map((c) => c.name).join("、");
  const studentNames = suggestedStudents.map((s) => s.name).join("、");
  const lineShareText = `【企業連絡】${companyName}\n${summary}\n共有CA: ${caNames || "要確認"}\n関連学生: ${studentNames || "要確認"}`;

  return NextResponse.json({
    suggestedCaIds: suggestedCas.map((c) => c.id),
    suggestedCaNames: suggestedCas.map((c) => c.name),
    suggestedStudentIds: suggestedStudents.map((s) => s.id),
    suggestedStudentNames: suggestedStudents.map((s) => s.name),
    aiSummary: summary,
    lineShareText,
  });
}
