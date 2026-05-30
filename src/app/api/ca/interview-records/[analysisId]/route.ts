import { NextRequest } from "next/server";
import { withJsonRoute, jsonError } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> }
) {
  const { analysisId } = await params;

  return withJsonRoute(async () => {
    const repo = getRepository();
    const record = await repo.getInterviewRecordByAnalysisId(analysisId);
    if (!record) {
      return jsonError("Record not found", 404, null);
    }
    return record;
  }, "Failed to fetch interview record", null);
}
