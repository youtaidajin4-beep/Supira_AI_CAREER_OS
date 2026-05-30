import { redirect } from "next/navigation";

export default async function CAAnalysisRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/analysis/${id}`);
}
