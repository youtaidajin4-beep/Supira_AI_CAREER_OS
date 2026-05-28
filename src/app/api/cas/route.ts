import { withJsonRoute } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET() {
  return withJsonRoute(async () => {
    const repo = getRepository();
    return repo.listCAs();
  }, "Failed to fetch CAs", []);
}
