"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { ExecutiveOverviewSection } from "@/components/executive/ExecutiveOverviewSection";
import { ExecutiveKpiBar } from "@/components/executive/ExecutiveKpiBar";
import { ExecutiveActionList } from "@/components/executive/ExecutiveActionList";
import { ExecutiveJudgmentRail } from "@/components/executive/ExecutiveJudgmentRail";
import { ExecutiveCAStrip } from "@/components/executive/ExecutiveCAStrip";
import { ExecutiveAlertsGrid } from "@/components/executive/ExecutiveAlertsGrid";
import { CompanyActionCard } from "@/components/operations/CompanyActionCard";
import { AddStudentModal } from "@/components/students/AddStudentModal";
import { buttonClass } from "@/components/ui/button";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { ExecutiveDashboardStats } from "@/lib/data/types";

export default function DashboardPage() {
  const [data, setData] = useState<ExecutiveDashboardStats | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);

  const load = async () => {
    const stats = await fetchJson<ExecutiveDashboardStats>(
      "/api/dashboard/executive",
      { fallback: () => clientMockFallback.executiveDashboard() }
    );
    setData(stats);
  };

  useEffect(() => {
    void load();
  }, []);

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const prioritySorted = data
    ? [...data.priorityCards].sort((a, b) => {
        const layerOrder = { critical: 0, attention: 1, info: 2 };
        return layerOrder[a.priorityLayer] - layerOrder[b.priorityLayer];
      })
    : [];

  const alertCount = data
    ? data.layeredAlerts.critical.length +
      data.layeredAlerts.attention.length +
      data.layeredAlerts.info.length
    : 0;

  return (
    <>
      <TopBar
        title="代表ダッシュボード"
        description="20名のCA・学生・企業を俯瞰する司令塔"
        actions={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className={buttonClass("primary", "md")}
          >
            <Plus className="h-4 w-4" />
            学生を追加
          </button>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto scroll-area bg-[#f3f4f6]">
        {!data ? (
          <div className="mx-auto max-w-6xl animate-pulse space-y-4 p-6">
            <div className="h-24 rounded-2xl bg-background-muted" />
            <div className="h-80 rounded-2xl bg-background-muted" />
          </div>
        ) : (
          <div className="mx-auto max-w-6xl space-y-6 p-5 sm:p-6">
            <ExecutiveKpiBar
              dateLabel={today}
              kpis={[
                {
                  label: "優先学生",
                  value: prioritySorted.length,
                  emphasis: "primary",
                },
                {
                  label: "代表介入",
                  value: data.interventions.length,
                  emphasis: "warning",
                },
                {
                  label: "未共有",
                  value: data.pendingCompanyUpdates.length,
                  emphasis: "warning",
                },
                {
                  label: "離脱リスク",
                  value: data.atRiskCount,
                  emphasis: "danger",
                },
              ]}
            />

            <div className="grid gap-6 lg:grid-cols-5">
              <div className="executive-panel lg:col-span-3">
                <div className="border-b border-border-subtle px-5 py-4">
                  <h2 className="text-sm font-semibold text-foreground">
                    今日やること
                  </h2>
                  <p className="mt-0.5 text-xs text-foreground-muted">
                    上から順に対応 · {prioritySorted.length}名
                  </p>
                </div>
                <ExecutiveActionList cards={prioritySorted} />
              </div>

              <div className="lg:col-span-2">
                <ExecutiveJudgmentRail
                  interventions={data.interventions}
                  companySummary={data.companyShareSummary}
                  insights={data.operationInsights}
                  layeredAlertCount={alertCount}
                />
              </div>
            </div>

            <ExecutiveAlertsGrid alerts={data.layeredAlerts} />

            <section>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    CAチームの状態
                  </h2>
                  <p className="text-xs text-foreground-muted">
                    フォローが必要な担当者
                  </p>
                </div>
                <Link href="/cas" className="text-xs font-medium text-accent hover:underline">
                  CA管理へ →
                </Link>
              </div>
              <ExecutiveCAStrip summaries={data.caAttentionList} />
            </section>

            {data.todayCompanyUpdates.length > 0 && (
              <section className="executive-panel p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">
                    今日共有する企業連絡
                  </h2>
                  <Link
                    href="/company-updates"
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    企業連絡へ →
                  </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-1 scroll-area">
                  {data.todayCompanyUpdates.map((u) => (
                    <CompanyActionCard key={u.id} update={u} />
                  ))}
                </div>
              </section>
            )}

            <div className="executive-panel overflow-hidden">
              <button
                type="button"
                onClick={() => setOverviewOpen((o) => !o)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold hover:bg-white/50"
              >
                組織概況（KPI）
                {overviewOpen ? (
                  <ChevronUp className="h-4 w-4 text-foreground-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-foreground-muted" />
                )}
              </button>
              {overviewOpen && (
                <div className="border-t border-border-subtle p-5">
                  <ExecutiveOverviewSection
                    stats={data}
                    cas={data.caSummaries}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <AddStudentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => load()}
      />
    </>
  );
}
