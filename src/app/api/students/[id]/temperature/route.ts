import { withJsonRoute } from "@/lib/api/route-handler";
import { getRepository } from "@/lib/data/get-repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withJsonRoute(
    async () => {
      const repo = getRepository();
      return repo.getTemperatureHistory(id);
    },
    "Failed to fetch temperature history",
    []
  );
}
