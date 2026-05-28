import { NextRequest, NextResponse } from "next/server";
import { analyzeTranscript } from "@/lib/ai/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript, studentContext } = body as {
      transcript?: string;
      studentContext?: string;
    };

    if (!transcript) {
      return NextResponse.json(
        { error: "transcript is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeTranscript(transcript, studentContext);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
