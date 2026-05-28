import Link from "next/link";
import type { CAOperationsSummary } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

function CAList({
  title,
  cas,
}: {
  title: string;
  cas: CAOperationsSummary["needsSupport"];
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-foreground-muted">{title}</p>
      {cas.length === 0 ? (
        <p className="text-xs text-foreground-muted">—</p>
      ) : (
        <ul className="space-y-1">
          {cas.slice(0, 3).map((ca) => (
            <li key={ca.id}>
              <Link
                href={`/cas/${ca.id}`}
                className="text-sm text-foreground hover:text-accent"
              >
                {ca.name}
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
    <DashboardSection title="CA運営" href="/cas">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <CAList title="要支援" cas={summary.needsSupport} />
        <CAList title="好調" cas={summary.performing} />
        <CAList title="更新停滞" cas={summary.stale} />
      </div>
    </DashboardSection>
  );
}
