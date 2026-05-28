import { NextRequest, NextResponse } from "next/server";
import { analyzeTranscript, transcribeAudio } from "@/lib/ai/openai";
import { getRepository } from "@/lib/data/get-repository";

const MAX_SIZE = 25 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const studentId = formData.get("studentId") as string | null;

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "file is required" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 25MB limit" },
        { status: 400 }
      );
    }

    const repo = getRepository();
    const student = await repo.getStudent(studentId);

    const studentContext = student
      ? `名前: ${student.name}\n大学: ${student.university}\n志望業界: ${student.industry}\n温度感: ${student.temperature}`
      : undefined;

    const transcript = await transcribeAudio(file);
    const analysisResult = await analyzeTranscript(
      transcript,
      studentContext
    );

    const analysis = await repo.createAnalysis({
      studentId,
      summary: analysisResult.summary,
      personality: analysisResult.personality,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      orientation: analysisResult.orientation,
      anxiety: analysisResult.anxiety,
      nextActions: analysisResult.nextActions,
      recommendedCompanies: analysisResult.recommendedCompanies,
      temperatureAnalysis: analysisResult.temperatureAnalysis,
      temperatureScore: analysisResult.temperatureScore,
    });

    const interview = await repo.createInterview({
      studentId,
      audioUrl: `mock://${studentId}/${Date.now()}`,
      transcript,
      summary: analysisResult.summary,
      analysisId: analysis.id,
    });

    await repo.updateStudent(studentId, {
      lastInterviewAt: interview.createdAt,
    });

    return NextResponse.json({
      interview,
      analysis,
      transcript,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload processing failed" },
      { status: 500 }
    );
  }
}
