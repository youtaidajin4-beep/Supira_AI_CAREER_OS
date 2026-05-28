import { NextRequest } from "next/server";
import { withJsonRoute, jsonOk, jsonError } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";
import type { CreateCompanyUpdateInput } from "@/lib/data/types";

export async function GET() {
  return withJsonRoute(async () => {
    const repo = getRepository();
    return repo.listCompanyUpdates();
  }, "Failed to fetch company updates", []);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: CreateCompanyUpdateInput = {
      companyName: String(body.companyName ?? ""),
      title: String(body.title ?? ""),
      content: String(body.content ?? ""),
      priority: body.priority ?? "medium",
      relatedCaIds: Array.isArray(body.relatedCaIds) ? body.relatedCaIds : [],
      relatedStudentIds: Array.isArray(body.relatedStudentIds)
        ? body.relatedStudentIds
        : [],
      shareStatus: body.shareStatus,
      deadline: String(body.deadline ?? new Date().toISOString()),
    };
    const repo = getRepository();
    const update = await repo.createCompanyUpdate(input);
    return jsonOk(update, { status: 201 });
  } catch (e) {
    return jsonError(
      e instanceof Error ? e.message : "Failed to create",
      400,
      null
    );
  }
}
