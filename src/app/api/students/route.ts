import { NextRequest } from "next/server";
import { withJsonRoute, jsonOk, jsonError } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";
import type { StudentFilters, StudentStatus } from "@/lib/data/types";

export async function GET(request: NextRequest) {
  return withJsonRoute(async () => {
    const { searchParams } = request.nextUrl;
    const filters: StudentFilters = {};

    const name = searchParams.get("name");
    const university = searchParams.get("university");
    const status = searchParams.get("status") as StudentStatus | null;
    const caId = searchParams.get("caId");

    if (name) filters.name = name;
    if (university) filters.university = university;
    if (status) filters.status = status;
    if (caId) filters.assignedCaId = caId;

    const repo = getRepository();
    return repo.listStudents(filters);
  }, "Failed to fetch students", []);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const repo = getRepository();
    const student = await repo.createStudent({
      name: String(body.name ?? ""),
      university: String(body.university ?? ""),
      grade: String(body.grade ?? ""),
      assignedCaId: String(body.assignedCaId ?? ""),
      industry: String(body.industry ?? ""),
      targetCompanies: Array.isArray(body.targetCompanies)
        ? body.targetCompanies.map(String)
        : String(body.targetCompanies ?? "")
            .split(/[,、]/)
            .map((s: string) => s.trim())
            .filter(Boolean),
      status: body.status ?? "before_interview",
      temperature: body.temperature ?? "medium",
      memo: String(body.memo ?? ""),
      createdAt: body.createdAt,
    });
    return jsonOk(student, { status: 201 });
  } catch (e) {
    return jsonError(
      e instanceof Error ? e.message : "Failed to create student",
      400,
      null
    );
  }
}
