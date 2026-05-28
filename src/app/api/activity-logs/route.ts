import { withJsonRoute } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET() {
  return withJsonRoute(
    async () => getRepository().listActivityLogs(),
    "Failed to fetch activity logs",
    []
  );
}
