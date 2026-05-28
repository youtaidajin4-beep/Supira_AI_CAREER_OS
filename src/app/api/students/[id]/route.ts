import { NextRequest } from "next/server";
import { withJsonRoute, jsonOk, jsonError } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withJsonRoute(async () => {
    const repo = getRepository();
    const student = await repo.getStudent(id);
    if (!student) {
      throw new Error("Not found");
    }
    return student;
  }, "Failed to fetch student", null);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const repo = getRepository();
    const student = await repo.updateStudent(id, body);
    return jsonOk(student);
  } catch {
    return jsonError("Not found", 404, null);
  }
}
