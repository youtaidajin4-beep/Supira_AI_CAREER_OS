import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("studentId");
    if (!studentId) {
      return jsonError("studentId is required", 400, null);
    }

    const repo = getRepository();
    const analysis = await repo.getLatestAnalysis(studentId);
    return jsonOk(analysis);
  } catch (e) {
    return jsonError(
      e instanceof Error ? e.message : "Failed to fetch analysis",
      500,
      null
    );
  }
}
