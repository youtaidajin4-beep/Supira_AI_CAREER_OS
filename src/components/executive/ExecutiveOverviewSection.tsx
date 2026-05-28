import Link from "next/link";
import { BarChart3, ChevronRight } from "lucide-react";
import type { CAUser, ExecutiveDashboardStats } from "@/lib/data/types";
import { PERFORMANCE_LABELS } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const kpiItems = [
  { key: "totalStudents", label: "総学生", sub: "名" },
  { key: "atRiskCount", label: "離脱リスク", sub: "名", accent: "danger" },
  { key: "unresponsiveCount", label: "7日+未対応", sub: "名", accent: "warning" },
  { key: "selectingCount", label: "選考中", sub: "名" },
  { key: "offerCount", label: "内定・承諾", sub: "名", accent: "success" },
  { key: "weeklyInterviews", label: "今週面談", sub: "件" },
  { key: "totalCAs", label: "CA", sub: "名" },
] as const;

export function ExecutiveOverviewSection({
  stats,
  cas,
}: {
  stats: ExecutiveDashboardStats;
  cas: CAUser[];
}) {
  const topRiskCas = [...cas]
    .sort((a, b) => b.riskStudentCount - a.riskStudentCount)
    .slice(0, 4);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-foreground-muted" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold text-foreground">組織の概況</h2>
          <span className="text-xs text-foreground-muted">
            KPI・CAサマリー
          </span>
        </div>
        <Link
          href="/cas"
          className="flex items-center gap-0.5 text-xs font-medium text-accent hover:underline"
        >
          CA一覧
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {kpiItems.map((item) => (
          <div
            key={item.key}
            className="rounded-lg border border-border bg-background px-3 py-3 shadow-xs"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
              {item.label}
            </p>
            <p
              className={cn(
                "mt-0.5 text-xl font-semibold tabular-nums",
                "accent" in item &&
                  item.accent === "danger" &&
                  stats[item.key] > 0 &&
                  "text-danger",
                "accent" in item &&
                  item.accent === "warning" &&
                  stats[item.key] > 0 &&
                  "text-warning",
                "accent" in item &&
                  item.accent === "success" &&
                  "text-success",
                !("accent" in item) && "text-foreground"
              )}
            >
              {stats[item.key]}
              <span className="ml-0.5 text-xs font-normal text-foreground-muted">
                {item.sub}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-background p-4 shadow-xs">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
          リスクの多いCA（上位）
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {topRiskCas.map((ca) => (
            <Link
              key={ca.id}
              href={`/cas/${ca.id}`}
              className={cn(
                "rounded-lg border border-border p-3 transition-colors hover:bg-background-subtle hover:shadow-xs",
                ca.riskStudentCount > 0 && "border-l-[3px] border-l-warning"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-foreground">{ca.name}</p>
                <span className="text-[10px] text-foreground-muted">
                  {PERFORMANCE_LABELS[ca.performanceStatus]}
                </span>
              </div>
              <div className="mt-2 flex gap-3 text-xs text-foreground-secondary">
                <span>
                  担当{" "}
                  <strong className="text-foreground">{ca.studentCount}</strong>
                </span>
                <span>
                  リスク{" "}
                  <strong
                    className={cn(
                      ca.riskStudentCount > 0 ? "text-danger" : "text-foreground"
                    )}
                  >
                    {ca.riskStudentCount}
                  </strong>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
