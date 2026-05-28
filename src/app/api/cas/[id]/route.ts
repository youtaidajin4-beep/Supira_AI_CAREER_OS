import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repo = getRepository();
    const dashboard = await repo.getCADashboard(id);
    if (!dashboard) {
      return jsonError("CA not found", 404, null);
    }
    return jsonOk(dashboard);
  } catch (e) {
    return jsonError(
      e instanceof Error ? e.message : "Failed to fetch CA dashboard",
      500,
      null
    );
  }
}
