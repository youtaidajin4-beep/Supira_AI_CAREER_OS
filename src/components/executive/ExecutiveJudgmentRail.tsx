import Link from "next/link";
import {
  AlertCircle,
  Building2,
  ChevronRight,
  Lightbulb,
  UserRound,
} from "lucide-react";
import type {
  CompanyShareSummary,
  ExecutiveIntervention,
  OperationInsight,
} from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

function JudgmentCard({
  title,
  icon: Icon,
  href,
  tone,
  children,
}: {
  title: string;
  icon: typeof AlertCircle;
  href?: string;
  tone: "danger" | "accent" | "violet" | "slate";
  children: React.ReactNode;
}) {
  const tones = {
    danger: {
      wrap: "from-danger-subtle/40 to-white border-danger/20",
      icon: "bg-danger text-white",
    },
    accent: {
      wrap: "from-accent-subtle/50 to-white border-accent/20",
      icon: "bg-accent text-white",
    },
    violet: {
      wrap: "from-violet-50 to-white border-violet-200/60",
      icon: "bg-violet-500 text-white",
    },
    slate: {
      wrap: "from-slate-50 to-white border-border",
      icon: "bg-slate-600 text-white",
    },
  };
  const t = tones[tone];

  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br p-4 shadow-sm",
        t.wrap
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", t.icon)}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-0.5 text-[11px] font-medium text-accent hover:underline"
          >
            すべて
            <ChevronRight className="h-3 w-3" />
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
    <div className="space-y-3">
      <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-accent px-4 py-3 text-white shadow-md">
        <p className="text-sm font-semibold">判断サポート</p>
        <p className="text-xs text-white/80">代表が見るべき要点</p>
      </div>

      <JudgmentCard title="代表介入" icon={UserRound} href="/alerts" tone="danger">
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
                    "flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 text-sm shadow-sm ring-1 ring-border-subtle transition-colors hover:bg-white",
                    item.severity === "critical" && "ring-danger/30"
                  )}
                >
                  <span className="font-medium text-foreground">{item.title}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-foreground-muted" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </JudgmentCard>

      <JudgmentCard title="企業共有" icon={Building2} href="/company-updates" tone="accent">
        <div className="flex gap-3">
          <div className="flex-1 rounded-lg bg-white/80 px-3 py-2 text-center ring-1 ring-border-subtle">
            <p className="text-xl font-bold tabular-nums text-foreground">
              {companySummary.unsharedCount}
            </p>
            <p className="text-[10px] text-foreground-muted">未共有</p>
          </div>
          <div className="flex-1 rounded-lg bg-accent-subtle px-3 py-2 text-center ring-1 ring-accent/20">
            <p className="text-xl font-bold tabular-nums text-accent">
              {companySummary.todayShareCount}
            </p>
            <p className="text-[10px] text-foreground-muted">今日</p>
          </div>
        </div>
        {companySummary.hotCompanies.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {companySummary.hotCompanies.slice(0, 3).map((c) => (
              <li key={c.companyId}>
                <Link
                  href={`/companies/${c.companyId}`}
                  className="text-sm text-foreground-secondary hover:text-accent"
                >
                  {c.companyName}
                  <span className="text-foreground-muted"> · {c.studentCount}名</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </JudgmentCard>

      <JudgmentCard title="AI提案" icon={Lightbulb} tone="violet">
        <ul className="space-y-2">
          {insights.slice(0, 2).map((insight) => (
            <li
              key={insight.id}
              className="rounded-lg bg-white/70 px-3 py-2 text-sm leading-relaxed text-foreground-secondary ring-1 ring-violet-100"
            >
              {insight.message}
            </li>
          ))}
        </ul>
      </JudgmentCard>

      <JudgmentCard title="アラート" icon={AlertCircle} href="/alerts" tone="slate">
        <p className="text-sm text-foreground-secondary">
          未対応{" "}
          <strong className="text-lg tabular-nums text-foreground">
            {layeredAlertCount}
          </strong>{" "}
          件
        </p>
        <Link
          href="/alerts"
          className="mt-3 inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-white hover:bg-foreground/90"
        >
          アラート一覧を開く
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </JudgmentCard>
    </div>
  );
}
