import Link from "next/link";
import type { CompanyShareSummary } from "@/lib/data/types";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export function CompanyShareSummaryPanel({
  summary,
}: {
  summary: CompanyShareSummary;
}) {
  return (
    <DashboardSection title="企業共有" href="/company-updates">
      <p className="text-sm text-foreground-secondary">
        未共有 <span className="font-semibold text-foreground">{summary.unsharedCount}</span>
        <span className="mx-2 text-border">·</span>
        今日の候補{" "}
        <span className="font-semibold text-accent">{summary.todayShareCount}</span>
      </p>
      {summary.hotCompanies.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-border-subtle pt-3">
          {summary.hotCompanies.slice(0, 3).map((c) => (
            <li key={c.companyId}>
              <Link
                href={`/companies/${c.companyId}`}
                className="flex justify-between text-sm hover:text-accent"
              >
                <span>{c.companyName}</span>
                <span className="text-foreground-muted">{c.studentCount}名</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
