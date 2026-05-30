import { NextRequest } from "next/server";
import { withJsonRoute, jsonError } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET(request: NextRequest) {
  return withJsonRoute(async () => {
    const { searchParams } = request.nextUrl;
    const studentId = searchParams.get("studentId");
    const caId = searchParams.get("caId");

    const repo = getRepository();

    if (studentId) {
      return repo.listInterviewRecordsByStudent(studentId);
    }

    if (caId) {
      return repo.listInterviewRecordsByCA(caId);
    }

    return jsonError("studentId or caId is required", 400, []);
  }, "Failed to fetch interview records", []);
}
