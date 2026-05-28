import { NextRequest } from "next/server";
import { jsonOk, jsonError } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const repo = getRepository();
    const update = await repo.updateCompanyUpdate(id, body);
    return jsonOk(update);
  } catch (e) {
    return jsonError(
      e instanceof Error ? e.message : "Update failed",
      400,
      null
    );
  }
}
