import Link from "next/link";
import type {
  CompanyShareSummary,
  ExecutiveIntervention,
  OperationInsight,
} from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

function Block({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border-subtle px-5 py-4 last:border-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          {title}
        </h3>
        {href && (
          <Link href={href} className="text-[11px] font-medium text-accent hover:underline">
            すべて
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

export function ExecutiveJudgmentRail({
  interventions,
  companySummary,
  insights,
  layeredAlertCount,
}: {
  interventions: ExecutiveIntervention[];
  companySummary: CompanyShareSummary;
  insights: OperationInsight[];
  layeredAlertCount: number;
}) {
  return (
    <div className="executive-panel overflow-hidden">
      <div className="border-b border-border-subtle bg-[#f8f9fb] px-5 py-3">
        <p className="text-sm font-semibold text-foreground">判断サポート</p>
        <p className="text-xs text-foreground-muted">代表が見るべき要点</p>
      </div>

      <Block title="代表介入" href="/alerts">
        {interventions.length === 0 ? (
          <p className="text-sm text-foreground-muted">候補なし</p>
        ) : (
          <ul className="space-y-2">
            {interventions.slice(0, 4).map((item) => (
              <li key={item.id}>
                <Link
                  href={
                    item.relatedStudentId
                      ? `/students/${item.relatedStudentId}`
                      : item.targetType === "ca"
                        ? `/cas/${item.targetId}`
                        : "/company-updates"
                  }
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm hover:bg-white",
                    item.severity === "critical" &&
                      "border-l-2 border-l-danger bg-danger-subtle/30"
                  )}
                >
                  <span className="font-medium text-foreground">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Block>

      <Block title="企業共有" href="/company-updates">
        <p className="text-sm text-foreground-secondary">
          未共有{" "}
          <strong className="text-foreground">{companySummary.unsharedCount}</strong>
          {" · "}
          今日{" "}
          <strong className="text-accent">{companySummary.todayShareCount}</strong>
        </p>
        {companySummary.hotCompanies.length > 0 && (
          <ul className="mt-2 space-y-1">
            {companySummary.hotCompanies.slice(0, 3).map((c) => (
              <li key={c.companyId}>
                <Link
                  href={`/companies/${c.companyId}`}
                  className="text-sm text-foreground-secondary hover:text-accent"
                >
                  {c.companyName}（{c.studentCount}名）
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Block>

      <Block title="AI提案">
        <ul className="space-y-2">
          {insights.slice(0, 2).map((insight) => (
            <li
              key={insight.id}
              className="text-sm leading-relaxed text-foreground-secondary"
            >
              {insight.message}
            </li>
          ))}
        </ul>
      </Block>

      <Block title="アラート" href="/alerts">
        <p className="text-sm text-foreground-secondary">
          未対応アラート{" "}
          <strong className="text-foreground">{layeredAlertCount}</strong> 件
        </p>
        <Link
          href="/alerts"
          className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
        >
          アラート一覧を開く →
        </Link>
      </Block>
    </div>
  );
}
