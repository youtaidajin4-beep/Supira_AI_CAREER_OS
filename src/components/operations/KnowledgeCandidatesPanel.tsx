import Link from "next/link";
import type { KnowledgeItem } from "@/lib/data/types";
import { KNOWLEDGE_CATEGORY_LABELS } from "@/lib/data/types";

export function KnowledgeCandidatesPanel({
  items,
}: {
  items: KnowledgeItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">
          ナレッジ候補
        </h3>
        <Link href="/knowledge" className="text-xs text-accent hover:underline">
          すべて見る
        </Link>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-border-subtle border-l-[3px] border-l-accent bg-accent-subtle/15 px-4 py-3"
          >
            <p className="text-[10px] font-medium text-foreground-muted">
              {KNOWLEDGE_CATEGORY_LABELS[item.category]}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {item.title}
            </p>
            <p className="mt-1 text-xs text-foreground-secondary">
              {item.aiSummary}
            </p>
            <p className="mt-2 text-xs text-accent">
              再利用: {item.reusablePoint}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
