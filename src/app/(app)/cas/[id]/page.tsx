"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { CASupportSuggestions } from "@/components/cas/CASupportSuggestions";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { PriorityLayerBadge } from "@/components/shared/PriorityLayerBadge";
import { Card } from "@/components/ui/card";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import { classifyStudentLayer } from "@/lib/priority/layers";
import type { CADashboardStats } from "@/lib/data/types";
import { STATUS_LABELS, TEMPERATURE_LABELS } from "@/lib/data/types";

export default function CADetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<CADashboardStats | null>(null);

  useEffect(() => {
    void fetchJson<CADashboardStats | null>(`/api/cas/${id}`, {
      fallback: () => clientMockFallback.caDashboard(id),
      allowNull: true,
    }).then((dashboard) => {
      if (dashboard) setData(dashboard);
    });
  }, [id]);

  if (!data) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-foreground-muted">
        読み込み中...
      </div>
    );
  }

  const {
    ca,
    students,
    performance,
    riskStudentsCritical,
    riskStudentsAttention,
    supportSuggestions,
  } = data;

  return (
    <>
      <TopBar
        title={ca.name}
        description={`${ca.role} · 担当${ca.studentCount}名`}
      />
      <div className="min-h-0 flex-1 overflow-y-auto scroll-area p-6">
        <Card className="mb-6 p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">CAサマリー</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["担当学生", performance.studentCount],
              ["高温度感", ca.highTempCount],
              ["離脱リスク", performance.atRiskCount],
              ["今週面談", performance.weeklyInterviewCount],
              ["メモ更新率", `${performance.memoUpdateRate}%`],
              ["未対応", performance.unresponsiveCount],
            ].map(([label, value]) => (
              <div key={String(label)} className="text-center">
                <p className="text-lg font-semibold tabular-nums">{value}</p>
                <p className="text-[10px] text-foreground-muted">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-foreground-muted">
            温度感平均: {TEMPERATURE_LABELS[performance.avgTemperature]}
          </p>
        </Card>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold">担当学生</h3>
              <ul className="divide-y divide-border-subtle">
                {students.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/students/${s.id}`}
                          className="font-medium hover:text-accent"
                        >
                          {s.name}
                        </Link>
                        <PriorityLayerBadge
                          layer={classifyStudentLayer(s)}
                        />
                      </div>
                      <p className="text-xs text-foreground-muted">
                        {STATUS_LABELS[s.status]}
                      </p>
                    </div>
                    <TemperatureBadge temperature={s.temperature} />
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-l-[3px] border-l-danger p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                今すぐ介入（Critical）
              </h3>
              {riskStudentsCritical.length === 0 ? (
                <p className="text-sm text-foreground-muted">なし</p>
              ) : (
                <ul className="space-y-2">
                  {riskStudentsCritical.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/students/${s.id}`}
                        className="text-sm font-medium hover:text-accent"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card className="border-l-[3px] border-l-warning p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                今日中に確認（Attention）
              </h3>
              {riskStudentsAttention.length === 0 ? (
                <p className="text-sm text-foreground-muted">なし</p>
              ) : (
                <ul className="space-y-2">
                  {riskStudentsAttention.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/students/${s.id}`}
                        className="text-sm font-medium hover:text-accent"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <CASupportSuggestions suggestions={supportSuggestions} />
          </div>
        </div>
      </div>
    </>
  );
}
