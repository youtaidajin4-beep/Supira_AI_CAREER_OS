import { withJsonRoute } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET() {
  return withJsonRoute(
    async () => getRepository().listCompanies(),
    "Failed to fetch companies",
    []
  );
}
