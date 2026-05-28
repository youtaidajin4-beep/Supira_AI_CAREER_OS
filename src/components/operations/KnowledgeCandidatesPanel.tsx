import Link from "next/link";
import type { KnowledgeItem } from "@/lib/data/types";
import { KNOWLEDGE_CATEGORY_LABELS } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export function KnowledgeCandidatesPanel({
  items,
}: {
  items: KnowledgeItem[];
}) {
  if (items.length === 0) return null;

  return (
    <DashboardSection
      title="ナレッジ候補"
      subtitle="組織に残す価値のある知見"
      href="/knowledge"
      badge={items.length}
      bodyClassName="!py-4"
    >
      <ul className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-accent/10 bg-accent-subtle/25 px-3 py-2.5"
          >
            <p className="text-[10px] font-medium text-accent">
              {KNOWLEDGE_CATEGORY_LABELS[item.category]}
            </p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {item.title}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-foreground-muted">
              {item.reusablePoint}
            </p>
          </li>
        ))}
      </ul>
    </DashboardSection>
  );
}
