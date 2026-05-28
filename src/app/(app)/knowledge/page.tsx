"use client";

import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { KnowledgeCategory, KnowledgeItem } from "@/lib/data/types";
import { KNOWLEDGE_CATEGORY_LABELS } from "@/lib/data/types";

const CATEGORIES = Object.keys(
  KNOWLEDGE_CATEGORY_LABELS
) as KnowledgeCategory[];

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [category, setCategory] = useState<string>("");
  const [extractOpen, setExtractOpen] = useState(false);

  useEffect(() => {
    const url = category
      ? `/api/knowledge?category=${category}`
      : "/api/knowledge";
    void fetchJson<KnowledgeItem[]>(url, {
      fallback: () => clientMockFallback.knowledge(category || undefined),
    }).then((data) => setItems(Array.isArray(data) ? data : []));
  }, [category]);

  const grouped = useMemo(() => {
    const map = new Map<string, KnowledgeItem[]>();
    for (const item of items) {
      const key = KNOWLEDGE_CATEGORY_LABELS[item.category];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items]);

  return (
    <>
      <TopBar
        title="ナレッジ"
        description="組織に蓄積されたCAノウハウ"
        actions={
          <Button type="button" onClick={() => setExtractOpen((o) => !o)}>
            AIナレッジ抽出（モック）
          </Button>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto scroll-area p-6">
        {extractOpen && (
          <Card className="mb-6 border-l-[3px] border-l-accent bg-accent-subtle/20 p-5">
            <h3 className="text-sm font-semibold">抽出結果（モック）</h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground-secondary">
              <li>うまくいった対応: 短時間面談で成功体験を一緒に振り返った</li>
              <li>前向きになった言葉: 「その判断、今のあなたらでは？」</li>
              <li>刺さった説明: プロダクト体験＋改善案のセット</li>
              <li>面接成功パターン: 結論→根拠→学びの3行構成</li>
            </ul>
          </Card>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              !category
                ? "bg-foreground text-background"
                : "bg-background-subtle text-foreground-secondary"
            }`}
          >
            すべて
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                category === c
                  ? "bg-foreground text-background"
                  : "bg-background-subtle text-foreground-secondary"
              }`}
            >
              {KNOWLEDGE_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([catLabel, catItems]) => (
            <section key={catLabel}>
              <h3 className="mb-3 text-sm font-semibold text-foreground-muted">
                {catLabel}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {catItems.map((item) => (
                  <Card key={item.id} className="p-5">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs text-foreground-secondary">
                      {item.aiSummary}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                      {item.content}
                    </p>
                    <p className="mt-3 rounded-md bg-accent-subtle/40 px-2 py-1.5 text-xs text-accent">
                      再利用: {item.reusablePoint}
                    </p>
                    <p className="mt-3 text-[10px] text-foreground-muted">
                      {item.createdByCaName}
                      {item.relatedStudentName &&
                        ` · ${item.relatedStudentName}`}
                      {item.relatedCompanyName &&
                        ` · ${item.relatedCompanyName}`}
                      {" · "}
                      {new Date(item.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
