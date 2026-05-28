import Link from "next/link";
import type { CAOperationsSummary } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";

function CAList({
  title,
  cas,
  empty,
}: {
  title: string;
  cas: CAOperationsSummary["needsSupport"];
  empty: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-foreground-muted">{title}</p>
      {cas.length === 0 ? (
        <p className="text-xs text-foreground-muted">{empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {cas.slice(0, 4).map((ca) => (
            <li key={ca.id}>
              <Link
                href={`/cas/${ca.id}`}
                className="flex items-center justify-between text-sm hover:text-accent"
              >
                <span className="font-medium">{ca.name}</span>
                <span className="text-[10px] text-foreground-muted">
                  {PERFORMANCE_LABELS[ca.performanceStatus]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CAOperationsSummaryPanel({
  summary,
}: {
  summary: CAOperationsSummary;
}) {
  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        CA運営サマリー
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <CAList
          title="支援が必要"
          cas={summary.needsSupport}
          empty="該当なし"
        />
        <CAList
          title="成果が出ている"
          cas={summary.performing}
          empty="該当なし"
        />
        <CAList
          title="更新が止まっている"
          cas={summary.stale}
          empty="該当なし"
        />
      </div>
    </section>
  );
}
