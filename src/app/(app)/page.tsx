"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { TodayWorkHero } from "@/components/executive/TodayWorkHero";
import { TodayPriorityPanel } from "@/components/executive/TodayPriorityPanel";
import { TodayTasksSidebar } from "@/components/executive/TodayTasksSidebar";
import { ExecutiveOverviewSection } from "@/components/executive/ExecutiveOverviewSection";
import { AddStudentModal } from "@/components/students/AddStudentModal";
import { buttonClass } from "@/components/ui/button";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { ExecutiveDashboardStats } from "@/lib/data/types";

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6 p-6 lg:p-8">
      <div className="h-36 rounded-2xl bg-background-muted" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-xl bg-background-muted lg:col-span-2" />
        <div className="h-80 rounded-xl bg-background-muted" />
      </div>
      <div className="h-32 rounded-xl bg-background-muted" />
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<ExecutiveDashboardStats | null>(null);
  const [addOpen, setAddOpen] = useState(false);

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

  return (
    <>
      <TopBar
        title="代表ダッシュボード"
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
            {/* ── 今日の業務（メイン） ── */}
            <TodayWorkHero
              dateLabel={today}
              priorityStudents={data.priorityStudents}
              criticalAlerts={data.criticalAlerts}
              pendingCompanyUpdates={data.pendingCompanyUpdates}
            />

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
              <div className="space-y-3 lg:col-span-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    優先して確認する学生
                  </h3>
                  <span className="text-xs text-foreground-muted">
                    {data.priorityStudents.length}名
                  </span>
                </div>
                <TodayPriorityPanel items={data.priorityStudents} />
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">
                  その他の今日のタスク
                </h3>
                <TodayTasksSidebar
                  alerts={data.criticalAlerts}
                  companyUpdates={data.pendingCompanyUpdates}
                />
              </div>
            </div>

            {/* ── 組織概況（サブ） ── */}
            <div className="border-t border-border pt-8">
              <ExecutiveOverviewSection
                stats={data}
                cas={data.caSummaries}
              />
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
