"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { TodayWorkHero } from "@/components/executive/TodayWorkHero";
import { ExecutiveOverviewSection } from "@/components/executive/ExecutiveOverviewSection";
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
import Link from "next/link";
import { AddStudentModal } from "@/components/students/AddStudentModal";
import { buttonClass } from "@/components/ui/button";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { ExecutiveDashboardStats } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6 p-6 lg:p-8">
      <div className="h-36 rounded-2xl bg-background-muted" />
      <div className="h-64 rounded-xl bg-background-muted" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-xl bg-background-muted" />
        <div className="h-80 rounded-xl bg-background-muted" />
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
          <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
            <TodayWorkHero
              dateLabel={today}
              priorityCount={data.priorityCards.length}
              interventionCount={data.interventions.length}
              criticalAlerts={data.criticalAlerts}
              pendingCompanyUpdates={data.pendingCompanyUpdates}
            />

            <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
              <section className="rounded-xl border border-border bg-background p-5 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">
                    今日の動き
                  </h3>
                  <Link
                    href="/activity-feed"
                    className="text-xs text-accent hover:underline"
                  >
                    すべて見る
                  </Link>
                </div>
                <ActivityFeed logs={data.activityFeed} compact />
              </section>
              <div className="lg:col-span-3">
                <LayeredAlertsPanel alerts={data.layeredAlerts} />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <CAOperationsSummaryPanel summary={data.caOperationsSummary} />
              <CompanyShareSummaryPanel summary={data.companyShareSummary} />
            </div>

            <KnowledgeCandidatesPanel items={data.knowledgeCandidates} />

            <section className="space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  今日優先対応すべき学生
                </h3>
                <span className="text-xs text-foreground-muted">
                  {data.priorityCards.length}名
                </span>
              </div>
              {data.priorityCards.length === 0 ? (
                <p className="rounded-xl border border-border bg-background px-4 py-8 text-center text-sm text-foreground-muted">
                  本日の介入候補はありません。下の組織概況で全体を確認できます。
                </p>
              ) : (
                <div className="space-y-3">
                  {data.priorityCards.map((card) => (
                    <PriorityStudentCard key={card.student.id} card={card} />
                  ))}
                </div>
              )}
            </section>

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <section className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">
                  CA注意一覧
                </h3>
                <div className="space-y-3">
                  {caAttentionSorted.slice(0, 4).map((summary) => (
                    <CAAttentionCard key={summary.ca.id} summary={summary} />
                  ))}
                </div>
              </section>
              <InterventionPanel interventions={data.interventions} />
            </div>

            <section className="space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  今日共有すべき企業情報
                </h3>
                <span className="text-xs text-foreground-muted">
                  {data.todayCompanyUpdates.length}件
                </span>
              </div>
              {data.todayCompanyUpdates.length === 0 ? (
                <p className="text-sm text-foreground-muted">
                  本日の共有候補はありません
                </p>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {data.todayCompanyUpdates.map((u) => (
                    <CompanyActionCard key={u.id} update={u} />
                  ))}
                </div>
              )}
            </section>

            <OperationInsightPanel insights={data.operationInsights} />

            <div className="border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setOverviewOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-semibold text-foreground hover:bg-background-subtle"
              >
                組織概況（KPI・CAサマリー）
                {overviewOpen ? (
                  <ChevronUp className="h-4 w-4 text-foreground-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-foreground-muted" />
                )}
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all",
                  overviewOpen ? "mt-4 max-h-[2000px]" : "max-h-0"
                )}
              >
                <ExecutiveOverviewSection
                  stats={data}
                  cas={data.caSummaries}
                />
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
