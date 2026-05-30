"use client";

import { useEffect, useState } from "react";
import { CAPageFrame } from "@/components/ca/CAPageFrame";
import { fetchJson } from "@/lib/api/fetch-json";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import type { KnowledgeItem } from "@/lib/data/types";
import { KNOWLEDGE_CATEGORY_LABELS } from "@/lib/data/types";

export default function CAKnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    void fetchJson<KnowledgeItem[]>("/api/knowledge", {
      fallback: () => clientMockFallback.knowledge(),
    }).then(setItems);
  }, []);

  return (
    <CAPageFrame
      title="ナレッジ"
      description="CA成功事例・面接対策などのナレッジベース"
    >
      <div className="p-5 pb-10 lg:p-6 lg:pb-12">
        {items.length === 0 ? (
          <p className="py-12 text-center text-sm text-foreground-muted">
            ナレッジがありません
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-border bg-white p-4 shadow-xs"
              >
                <p className="text-[11px] font-medium text-accent">
                  {KNOWLEDGE_CATEGORY_LABELS[item.category]}
                </p>
                <h3 className="mt-1 font-medium text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                  {item.aiSummary || item.content.slice(0, 120)}
                </p>
                <p className="mt-2 text-xs text-foreground-muted">
                  {item.createdByCaName}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </CAPageFrame>
  );
}
