import { NextRequest } from "next/server";
import { withJsonRoute } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET(request: NextRequest) {
  return withJsonRoute(async () => {
    const { searchParams } = request.nextUrl;
    const repo = getRepository();
    return repo.listAlerts({
      severity: searchParams.get("severity") ?? undefined,
      caId: searchParams.get("caId") ?? undefined,
      unresolvedOnly: searchParams.get("resolved") !== "true",
    });
  }, "Failed to fetch alerts", []);
}
