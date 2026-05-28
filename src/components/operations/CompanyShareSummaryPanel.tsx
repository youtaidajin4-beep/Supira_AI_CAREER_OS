import Link from "next/link";
import type { CompanyShareSummary } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export function CompanyShareSummaryPanel({
  summary,
}: {
  summary: CompanyShareSummary;
}) {
  return (
    <DashboardSection
      title="企業共有"
      subtitle="未共有・今日の共有候補"
      href="/company-updates"
      bodyClassName="!py-4"
    >
      <div className="mb-4 flex gap-6">
        <div>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {summary.unsharedCount}
          </p>
          <p className="text-[11px] text-foreground-muted">未共有</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums text-accent">
            {summary.todayShareCount}
          </p>
          <p className="text-[11px] text-foreground-muted">今日共有候補</p>
        </div>
      </div>
      {summary.hotCompanies.length > 0 && (
        <ul className="space-y-1.5 border-t border-border-subtle pt-3">
          {summary.hotCompanies.slice(0, 3).map((c) => (
            <li key={c.companyId}>
              <Link
                href={`/companies/${c.companyId}`}
                className="flex justify-between text-sm text-foreground-secondary hover:text-accent"
              >
                <span className="truncate">{c.companyName}</span>
                <span className="shrink-0 tabular-nums text-foreground-muted">
                  {c.studentCount}名
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
