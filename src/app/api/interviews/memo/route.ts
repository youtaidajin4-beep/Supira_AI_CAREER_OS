import { NextRequest, NextResponse } from "next/server";
import { memoAnalysisResultSchema } from "@/lib/ai/schemas";
import { getRepository } from "@/lib/data/get-repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, memo, analysis: analysisInput } = body as {
      studentId?: string;
      memo?: string;
      analysis?: unknown;
    };

    if (!studentId) {
      return NextResponse.json(
        { error: "学生が指定されていません" },
        { status: 400 }
      );
    }

    if (!memo || typeof memo !== "string" || !memo.trim()) {
      return NextResponse.json(
        { error: "面談メモが必要です" },
        { status: 400 }
      );
    }

    if (!analysisInput) {
      return NextResponse.json(
        { error: "分析結果が必要です。先にAI要約を生成してください" },
        { status: 400 }
      );
    }

    const parsed = memoAnalysisResultSchema.safeParse(analysisInput);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "分析結果の形式が正しくありません" },
        { status: 400 }
      );
    }

    const analysisResult = parsed.data;
    const repo = getRepository();

    const student = await repo.getStudent(studentId);
    if (!student) {
      return NextResponse.json(
        { error: "学生が見つかりません" },
        { status: 404 }
      );
    }

    const analysis = await repo.createAnalysis({
      studentId,
      summary: analysisResult.summary,
      personality: analysisResult.personality,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      orientation: analysisResult.orientation,
      anxiety: analysisResult.anxiety,
      nextActions: analysisResult.nextActions,
      recommendedCompanies: [],
      caRecommendedActions: analysisResult.caRecommendedActions,
      temperatureAnalysis: analysisResult.temperatureAnalysis,
      temperatureScore: analysisResult.temperatureScore,
      source: "memo",
    });

    const interview = await repo.createInterview({
      studentId,
      audioUrl: "",
      transcript: memo.trim(),
      summary: analysisResult.summary,
      analysisId: analysis.id,
    });

    await repo.updateStudent(studentId, {
      lastInterviewAt: interview.createdAt,
    });

    return NextResponse.json({ interview, analysis });
  } catch (error) {
    console.error("Save memo error:", error);
    return NextResponse.json(
      { error: "保存に失敗しました。再度お試しください。" },
      { status: 500 }
    );
  }
}
