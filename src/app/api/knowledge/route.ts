import { withJsonRoute } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  return withJsonRoute(
    async () => getRepository().listKnowledge(category),
    "Failed to fetch knowledge",
    []
  );
}
