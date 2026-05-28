import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/ai/openai";

const MAX_SIZE = 25 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

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

    const transcript = await transcribeAudio(file);
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Transcribe error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
