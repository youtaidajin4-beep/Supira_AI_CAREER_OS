import type { KnowledgeItem } from "@/lib/data/types";

export function pickKnowledgeCandidates(
  items: KnowledgeItem[],
  limit = 4
): KnowledgeItem[] {
  return [...items]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}
