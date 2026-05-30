"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CAHomeTodayCards } from "@/components/ca/CAHomeTodayCards";
import { CAPriorityStudentList } from "@/components/ca/CAPriorityStudentList";
import { CAStudentTable } from "@/components/ca/CAStudentTable";
import { CAPageFrame } from "@/components/ca/CAPageFrame";
import { useAuth } from "@/lib/auth/auth-context";
import { fetchJson } from "@/lib/api/fetch-json";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import type { CAHomeData } from "@/lib/ca/home-stats";
import { buttonClass } from "@/components/ui/button";
import { Mic } from "lucide-react";

export default function CAHomePage() {
  const { session } = useAuth();
  const caId = session?.caId ?? "";
  const [data, setData] = useState<CAHomeData | null>(null);

  useEffect(() => {
    if (!caId) return;
    void fetchJson<CAHomeData>(`/api/ca/home?caId=${caId}`, {
      fallback: async () => {
        const home = await clientMockFallback.caHome(caId);
        if (!home) {
          return {
            today: {
              todayInterviews: 0,
              needsFollowUp: 0,
              missingNextAction: 0,
              atRiskCount: 0,
            },
            priorityStudents: [],
            students: [],
          };
        }
        return home;
      },
    }).then((d) => {
      if (d && !("error" in (d as object))) setData(d);
    });
  }, [caId]);

  const firstName = session?.name?.split(/\s/)[0] ?? "CA";

  return (
    <CAPageFrame
      title={`おはようございます、${firstName}さん`}
      description="今日やることを確認して、面談記録を残しましょう"
      scrollClassName="ca-page-bg"
      actions={
        <Link href="/ca/interviews" className={buttonClass("primary", "md")}>
          <Mic className="h-4 w-4" />
          面談を記録
        </Link>
      }
    >
      <div className="space-y-8 p-5 pb-10 lg:p-6 lg:pb-12">
        {data ? (
          <>
            <section>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                今日やること
              </h2>
              <CAHomeTodayCards stats={data.today} />
            </section>

            <section className="rounded-xl border border-border bg-white p-4 shadow-xs">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  今日の優先学生
                </h2>
                <span className="text-xs text-foreground-muted">AI抽出</span>
              </div>
              <CAPriorityStudentList cards={data.priorityStudents} />
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  担当学生一覧
                </h2>
                <Link
                  href="/ca/students"
                  className="text-xs font-medium text-accent hover:text-accent-hover"
                >
                  すべて見る
                </Link>
              </div>
              <CAStudentTable students={data.students.slice(0, 8)} />
            </section>
          </>
        ) : (
          <p className="py-12 text-center text-sm text-foreground-muted">
            読み込み中...
          </p>
        )}
      </div>
    </CAPageFrame>
  );
}
