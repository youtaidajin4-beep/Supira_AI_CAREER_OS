"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { TodayWorkHero } from "@/components/executive/TodayWorkHero";
import { ExecutiveOverviewSection } from "@/components/executive/ExecutiveOverviewSection";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardQuickStats } from "@/components/dashboard/DashboardQuickStats";
import { PriorityStudentCard } from "@/components/operations/PriorityStudentCard";
import { CAAttentionCard } from "@/components/operations/CAAttentionCard";
import { CompanyActionCard } from "@/components/operations/CompanyActionCard";
import { OperationInsightPanel } from "@/components/operations/OperationInsightPanel";
import { InterventionPanel } from "@/components/operations/InterventionPanel";
import { ActivityFeed } from "@/components/operations/ActivityFeed";
import { LayeredAlertsPanel } from "@/components/operations/LayeredAlertsPanel";
import { CAOperationsSummaryPanel } from "@/components/operations/CAOperationsSummaryPanel";
import { CompanyShareSummaryPanel } from "@/components/operations/CompanyShareSummaryPanel";
import { KnowledgeCandidatesPanel } from "@/components/operations/KnowledgeCandidatesPanel";
import { AddStudentModal } from "@/components/students/AddStudentModal";
import { buttonClass } from "@/components/ui/button";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { ExecutiveDashboardStats } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 p-6 lg:p-8">
      <div className="h-32 rounded-2xl bg-background-muted" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-background-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="h-96 rounded-2xl bg-background-muted lg:col-span-8" />
        <div className="h-96 rounded-2xl bg-background-muted lg:col-span-4" />
      </div>
    </div>
  );
}

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

  const caAttentionSorted = data
    ? [...data.caAttentionList].sort((a, b) => {
        const score = (s: typeof a) =>
          (s.ca.performanceStatus === "needs_support" ? 10 : 0) +
          s.delayedReplyCount * 2 +
          (100 - s.interviewUpdateRate) / 20;
        return score(b) - score(a);
      })
    : [];

  const prioritySorted = data
    ? [...data.priorityCards].sort((a, b) => {
        const layerOrder = { critical: 0, attention: 1, info: 2 };
        return layerOrder[a.priorityLayer] - layerOrder[b.priorityLayer];
      })
    : [];

  return (
    <>
      <TopBar
        title="オペレーションセンター"
        description="福与さん · 代表モード"
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
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain scroll-area scroll-smooth bg-background-subtle">
        {!data ? (
          <DashboardSkeleton />
        ) : (
          <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-6 lg:space-y-7 lg:p-8">
            <TodayWorkHero
              dateLabel={today}
              priorityCount={data.priorityCards.length}
              interventionCount={data.interventions.length}
              criticalAlerts={data.criticalAlerts}
              pendingCompanyUpdates={data.pendingCompanyUpdates}
            />

            <DashboardQuickStats
              items={[
                {
                  label: "優先学生",
                  value: data.priorityCards.length,
                  tone: "accent",
                },
                {
                  label: "介入候補",
                  value: data.interventions.length,
                  tone: "warning",
                },
                {
                  label: "未共有連絡",
                  value: data.pendingCompanyUpdates.length,
                  tone: "warning",
                },
                {
                  label: "離脱リスク",
                  value: data.atRiskCount,
                  tone: "danger",
                },
              ]}
            />

            {/* メイン: 優先学生 + サイド: ライブフィード */}
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
              <div className="space-y-6 lg:col-span-8">
                <DashboardSection
                  title="今日優先対応すべき学生"
                  subtitle="Critical・Attention を上から確認"
                  href="/students"
                  badge={prioritySorted.length}
                >
                  {prioritySorted.length === 0 ? (
                    <p className="py-10 text-center text-sm text-foreground-muted">
                      本日の介入候補はありません
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {prioritySorted.map((card, i) => (
                        <PriorityStudentCard
                          key={card.student.id}
                          card={card}
                          rank={i + 1}
                        />
                      ))}
                    </div>
                  )}
                </DashboardSection>

                <LayeredAlertsPanel alerts={data.layeredAlerts} layout="grid" />
              </div>

              <aside className="space-y-6 lg:col-span-4">
                <DashboardSection
                  title="今日の動き"
                  subtitle="現場のリアルタイムログ"
                  href="/activity-feed"
                  bodyClassName="!py-3 sm:!py-4"
                >
                  <ActivityFeed logs={data.activityFeed} compact />
                </DashboardSection>

                <InterventionPanel
                  interventions={data.interventions}
                  compact
                />
              </aside>
            </div>

            {/* 運営サマリー 3列 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              <CAOperationsSummaryPanel summary={data.caOperationsSummary} />
              <CompanyShareSummaryPanel summary={data.companyShareSummary} />
              <OperationInsightPanel insights={data.operationInsights} />
            </div>

            {/* 企業連絡 */}
            <DashboardSection
              title="今日共有すべき企業情報"
              subtitle="LINE文コピー・担当CAへの共有"
              href="/company-updates"
              badge={data.todayCompanyUpdates.length}
              bodyClassName="!px-0 !pb-0 sm:!px-0 sm:!pb-0"
            >
              {data.todayCompanyUpdates.length === 0 ? (
                <p className="px-5 pb-6 text-sm text-foreground-muted sm:px-6">
                  本日の共有候補はありません
                </p>
              ) : (
                <div className="flex gap-4 overflow-x-auto px-5 pb-5 scroll-area sm:px-6 sm:pb-6">
                  {data.todayCompanyUpdates.map((u) => (
                    <CompanyActionCard key={u.id} update={u} />
                  ))}
                </div>
              )}
            </DashboardSection>

            {/* CA注意 + ナレッジ */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-7">
              <DashboardSection
                title="CA注意一覧"
                subtitle="フォローが必要な担当者"
                href="/cas"
                badge={caAttentionSorted.length}
              >
                <div className="space-y-3">
                  {caAttentionSorted.slice(0, 3).map((summary) => (
                    <CAAttentionCard key={summary.ca.id} summary={summary} />
                  ))}
                </div>
              </DashboardSection>

              <KnowledgeCandidatesPanel items={data.knowledgeCandidates} />
            </div>

            {/* 組織概況 */}
            <div className="dashboard-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOverviewOpen((o) => !o)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-background-subtle/50 sm:px-6"
              >
                <div>
                  <p className="text-[15px] font-semibold text-foreground">
                    組織概況
                  </p>
                  <p className="text-xs text-foreground-muted">
                    KPI・CAチーム全体
                  </p>
                </div>
                {overviewOpen ? (
                  <ChevronUp className="h-4 w-4 text-foreground-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-foreground-muted" />
                )}
              </button>
              <div
                className={cn(
                  "border-t border-border-subtle transition-all",
                  overviewOpen
                    ? "max-h-[2400px] opacity-100"
                    : "max-h-0 overflow-hidden opacity-0"
                )}
              >
                <div className="p-5 sm:p-6">
                  <ExecutiveOverviewSection
                    stats={data}
                    cas={data.caSummaries}
                  />
                </div>
              </div>
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
