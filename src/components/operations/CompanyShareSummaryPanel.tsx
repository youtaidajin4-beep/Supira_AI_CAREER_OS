import Link from "next/link";
import type { CompanyShareSummary } from "@/lib/data/types";

export function CompanyShareSummaryPanel({
  summary,
}: {
  summary: CompanyShareSummary;
}) {
  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        企業共有サマリー
      </h3>
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div>
          <p className="text-xs text-foreground-muted">未共有</p>
          <p className="text-xl font-semibold tabular-nums">{summary.unsharedCount}</p>
        </div>
        <div>
          <p className="text-xs text-foreground-muted">今日共有候補</p>
          <p className="text-xl font-semibold tabular-nums">
            {summary.todayShareCount}
          </p>
        </div>
      </div>
      {summary.hotCompanies.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-foreground-muted">
            選考中学生が多い企業
          </p>
          <ul className="space-y-1.5">
            {summary.hotCompanies.map((c) => (
              <li key={c.companyId}>
                <Link
                  href={`/companies/${c.companyId}`}
                  className="flex justify-between text-sm hover:text-accent"
                >
                  <span>{c.companyName}</span>
                  <span className="text-foreground-muted">
                    {c.studentCount}名
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link
        href="/company-updates"
        className="mt-3 inline-block text-xs font-medium text-accent hover:underline"
      >
        企業連絡ページへ →
      </Link>
    </section>
  );
}
