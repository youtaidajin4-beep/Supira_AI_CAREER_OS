import type { KnowledgeItem } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export function KnowledgeCandidatesPanel({
  items,
}: {
  items: KnowledgeItem[];
}) {
  if (items.length === 0) return null;

  return (
    <DashboardSection title="ナレッジ候補" href="/knowledge" badge={items.length}>
      <ul className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <li key={item.id}>
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            <p className="text-xs text-foreground-muted">{item.reusablePoint}</p>
          </li>
        ))}
      </ul>
    </DashboardSection>
  );
}
