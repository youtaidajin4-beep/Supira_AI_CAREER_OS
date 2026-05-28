"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { ExecutiveOverviewSection } from "@/components/executive/ExecutiveOverviewSection";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardSummaryBar } from "@/components/dashboard/DashboardSummaryBar";
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

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-4 p-6">
      <div className="h-8 rounded bg-background-muted" />
      <div className="h-64 rounded-xl bg-background-muted" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-48 rounded-xl bg-background-muted lg:col-span-2" />
        <div className="h-48 rounded-xl bg-background-muted" />
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
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain scroll-area bg-background-subtle">
        {!data ? (
          <DashboardSkeleton />
        ) : (
          <div className="mx-auto max-w-6xl space-y-5 p-5 sm:p-6">
            <DashboardSummaryBar
              dateLabel={today}
              items={[
                { label: "優先学生", value: data.priorityCards.length, highlight: true },
                { label: "介入", value: data.interventions.length },
                { label: "未共有", value: data.pendingCompanyUpdates.length },
                { label: "離脱リスク", value: data.atRiskCount },
              ]}
            />

            <div className="grid gap-5 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                <DashboardSection
                  title="優先学生"
                  href="/students"
                  badge={prioritySorted.length}
                >
                  {prioritySorted.length === 0 ? (
                    <p className="text-sm text-foreground-muted">
                      本日の優先候補はありません
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {prioritySorted.map((card) => (
                        <PriorityStudentCard key={card.student.id} card={card} />
                      ))}
                    </div>
                  )}
                </DashboardSection>

                <LayeredAlertsPanel alerts={data.layeredAlerts} />
              </div>

              <aside className="space-y-5">
                <DashboardSection title="今日の動き" href="/activity-feed">
                  <ActivityFeed logs={data.activityFeed} compact />
                </DashboardSection>
                <InterventionPanel interventions={data.interventions} />
              </aside>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <CAOperationsSummaryPanel summary={data.caOperationsSummary} />
              <CompanyShareSummaryPanel summary={data.companyShareSummary} />
              <OperationInsightPanel insights={data.operationInsights} />
            </div>

            <DashboardSection
              title="企業連絡（今日共有）"
              href="/company-updates"
              badge={data.todayCompanyUpdates.length}
            >
              {data.todayCompanyUpdates.length === 0 ? (
                <p className="text-sm text-foreground-muted">候補なし</p>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-1 scroll-area">
                  {data.todayCompanyUpdates.map((u) => (
                    <CompanyActionCard key={u.id} update={u} />
                  ))}
                </div>
              )}
            </DashboardSection>

            <div className="grid gap-5 lg:grid-cols-2">
              <DashboardSection title="CA注意" href="/cas">
                <div className="space-y-2">
                  {caAttentionSorted.slice(0, 3).map((summary) => (
                    <CAAttentionCard key={summary.ca.id} summary={summary} />
                  ))}
                </div>
              </DashboardSection>
              <KnowledgeCandidatesPanel items={data.knowledgeCandidates} />
            </div>

            <div className="rounded-xl border border-border/70 bg-background">
              <button
                type="button"
                onClick={() => setOverviewOpen((o) => !o)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-background-subtle/50 sm:px-5"
              >
                組織概況
                {overviewOpen ? (
                  <ChevronUp className="h-4 w-4 text-foreground-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-foreground-muted" />
                )}
              </button>
              {overviewOpen && (
                <div className="border-t border-border-subtle p-4 sm:p-5">
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
