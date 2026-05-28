import Link from "next/link";
import type { CAOperationsSummary } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

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
    <div className="rounded-xl bg-background-subtle/60 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
        {title}
      </p>
      {cas.length === 0 ? (
        <p className="text-xs text-foreground-muted">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {cas.slice(0, 3).map((ca) => (
            <li key={ca.id}>
              <Link
                href={`/cas/${ca.id}`}
                className="flex items-center justify-between gap-2 rounded-lg px-1 py-0.5 text-sm transition-colors hover:bg-background/80"
              >
                <span className="font-medium text-foreground">{ca.name}</span>
                <span className="shrink-0 text-[10px] text-foreground-muted">
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
    <DashboardSection
      title="CA運営"
      subtitle="チームの状態をひと目で"
      href="/cas"
      bodyClassName="!py-4"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <CAList title="要支援" cas={summary.needsSupport} empty="—" />
        <CAList title="好調" cas={summary.performing} empty="—" />
        <CAList title="更新停滞" cas={summary.stale} empty="—" />
      </div>
    </DashboardSection>
  );
}
