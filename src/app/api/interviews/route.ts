import { NextRequest } from "next/server";
import { withJsonRoute, jsonError } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("studentId");
  if (!studentId) {
    return jsonError("studentId is required", 400, []);
  }

  return withJsonRoute(async () => {
    const repo = getRepository();
    return repo.listInterviews(studentId);
  }, "Failed to fetch interviews", []);
}
