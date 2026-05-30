import { NextRequest, NextResponse } from "next/server";
import { analyzeMemo } from "@/lib/ai/openai";
import { getRepository } from "@/lib/data/get-repository";

const MIN_LENGTH = 10;
const MAX_LENGTH = 10000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, memo } = body as {
      studentId?: string;
      memo?: string;
    };

    if (!studentId) {
      return NextResponse.json(
        { error: "学生が指定されていません" },
        { status: 400 }
      );
    }

    if (!memo || typeof memo !== "string") {
      return NextResponse.json(
        { error: "面談メモを入力してください" },
        { status: 400 }
      );
    }

    const trimmed = memo.trim();
    if (trimmed.length < MIN_LENGTH) {
      return NextResponse.json(
        { error: `面談メモは${MIN_LENGTH}文字以上で入力してください` },
        { status: 400 }
      );
    }

    if (trimmed.length > MAX_LENGTH) {
      return NextResponse.json(
        { error: `面談メモは${MAX_LENGTH}文字以内で入力してください` },
        { status: 400 }
      );
    }

    const repo = getRepository();
    const student = await repo.getStudent(studentId);

    if (!student) {
      return NextResponse.json(
        { error: "学生が見つかりません" },
        { status: 404 }
      );
    }

    const studentContext = `名前: ${student.name}\n大学: ${student.university}\n学年: ${student.grade}\n志望業界: ${student.industry}\nステータス: ${student.status}\n温度感: ${student.temperature}\n次回アクション: ${student.nextAction}\nESメモ: ${student.esMemo || "なし"}\nリスク: ${student.riskReason || "なし"}`;

    const analysis = await analyzeMemo(trimmed, studentContext);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analyze memo error:", error);
    return NextResponse.json(
      {
        error:
          "AI要約の生成に失敗しました。しばらくしてから再度お試しください。",
      },
      { status: 500 }
    );
  }
}
