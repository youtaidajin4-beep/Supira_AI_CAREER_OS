"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { CASupportSuggestions } from "@/components/cas/CASupportSuggestions";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { FollowIndicator } from "@/components/shared/FollowIndicator";
import { Card } from "@/components/ui/card";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { CADashboardStats } from "@/lib/data/types";
import { STATUS_LABELS } from "@/lib/data/types";

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

  const { ca, students, atRiskStudents, actionStudents, supportSuggestions } =
    data;

  return (
    <>
      <TopBar
        title={ca.name}
        description={`${ca.role} · 担当${ca.studentCount}名`}
      />
      <div className="min-h-0 flex-1 overflow-y-auto scroll-area p-6">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["担当学生", ca.studentCount],
            ["離脱リスク", ca.riskStudentCount],
            ["今週面談", ca.weeklyInterviewCount],
            ["アラート", ca.openAlertCount],
          ].map(([label, value]) => (
            <Card key={String(label)} className="p-4 text-center">
              <p className="text-xs text-foreground-muted">{label}</p>
              <p className="text-xl font-semibold tabular-nums">{value}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold">担当学生</h3>
              <ul className="divide-y divide-border-subtle">
                {students.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/students/${s.id}`}
                        className="font-medium hover:text-accent"
                      >
                        {s.name}
                      </Link>
                      <p className="text-xs text-foreground-muted">
                        {STATUS_LABELS[s.status]}
                      </p>
                      <FollowIndicator student={s} className="mt-1" />
                    </div>
                    <TemperatureBadge temperature={s.temperature} />
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold text-danger">
                離脱リスク学生
              </h3>
              {atRiskStudents.length === 0 ? (
                <p className="text-sm text-foreground-muted">なし</p>
              ) : (
                <ul className="space-y-2">
                  {atRiskStudents.map((s) => (
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
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold">今週対応すべき学生</h3>
              <ul className="space-y-2">
                {actionStudents.map((s) => (
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
            </Card>
            <CASupportSuggestions suggestions={supportSuggestions} />
          </div>
        </div>
      </div>
    </>
  );
}
