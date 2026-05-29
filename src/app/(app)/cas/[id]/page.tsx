"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { CADetailHeader } from "@/components/cas/CADetailHeader";
import { CAStudentTable } from "@/components/cas/CAStudentTable";
import { CARiskPanel } from "@/components/cas/CARiskPanel";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { CADashboardStats } from "@/lib/data/types";

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
      <div className="flex flex-1 items-center justify-center ca-page-bg text-sm text-foreground-muted">
        読み込み中...
      </div>
    );
  }

  const { ca, students, performance, riskStudentsCritical, riskStudentsAttention } =
    data;

  return (
    <>
      <TopBar title={ca.name} />
      <div className="min-h-0 flex-1 overflow-y-auto scroll-area ca-page-bg">
        <div className="mx-auto max-w-6xl space-y-6 p-5 sm:p-6">
          <CADetailHeader ca={ca} performance={performance} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-card lg:col-span-2">
              <div className="flex items-center gap-3 border-b border-border-subtle bg-gradient-to-r from-accent-subtle/40 to-white px-5 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white text-xs font-bold">
                  {students.length}
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    担当学生一覧
                  </h2>
                  <p className="text-xs text-foreground-muted">
                    名前をクリックで詳細へ
                  </p>
                </div>
              </div>
              <div className="px-5 py-2">
                <CAStudentTable students={students} />
              </div>
            </div>

            <CARiskPanel
              critical={riskStudentsCritical}
              attention={riskStudentsAttention}
            />
          </div>
        </div>
      </div>
    </>
  );
}
