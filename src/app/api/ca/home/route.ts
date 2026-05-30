import { NextRequest } from "next/server";
import { withJsonRoute, jsonError } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";
import { buildCAHomeData } from "@/lib/ca/home-stats";
import type { AIAnalysis, Interview } from "@/lib/data/types";

export async function GET(request: NextRequest) {
  return withJsonRoute(async () => {
    const caId = request.nextUrl.searchParams.get("caId");
    if (!caId) {
      return jsonError("caId is required", 400, null);
    }

    const repo = getRepository();
    const dashboard = await repo.getCADashboard(caId);
    if (!dashboard) {
      return jsonError("CA not found", 404, null);
    }

    const [analyses, interviewLists] = await Promise.all([
      Promise.all(
        dashboard.students.map((s) => repo.getLatestAnalysis(s.id))
      ),
      Promise.all(
        dashboard.students.map((s) => repo.listInterviews(s.id))
      ),
    ]);

    const analysisMap = new Map<string, AIAnalysis>();
    for (const a of analyses) {
      if (a) analysisMap.set(a.studentId, a);
    }

    const mineInterviews: Interview[] = interviewLists.flat();

    return buildCAHomeData(
      dashboard.students,
      mineInterviews,
      analysisMap
    );
  }, "Failed to fetch CA home", null);
}
