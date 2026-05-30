"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Mic } from "lucide-react";
import { StudentList } from "@/components/students/StudentList";
import { StudentKarte } from "@/components/students/StudentKarte";
import { StudentTabs } from "@/components/students/StudentTabs";
import { AnalysisPanel } from "@/components/ai/AnalysisPanel";
import { PortalContextBar } from "@/components/shared/PortalContextBar";
import { buttonClass } from "@/components/ui/button";
import { ListItemSkeleton } from "@/components/ui/skeleton";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { AIAnalysis, Student, TemperatureSnapshot } from "@/lib/data/types";

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [interviewRefreshKey, setInterviewRefreshKey] = useState(0);
  const [temperatureHistory, setTemperatureHistory] = useState<
    TemperatureSnapshot[]
  >([]);

  useEffect(() => {
    void (async () => {
      const [studentData, analysisData, tempData] = await Promise.all([
        fetchJson<Student | null>(`/api/students/${id}`, {
          fallback: () => clientMockFallback.student(id),
          allowNull: true,
        }),
        fetchJson<AIAnalysis | null>(`/api/analysis?studentId=${id}`, {
          fallback: () => clientMockFallback.analysis(id),
          allowNull: true,
        }),
        fetchJson<TemperatureSnapshot[]>(
          `/api/students/${id}/temperature`,
          {
            fallback: () => clientMockFallback.temperatureHistory(id),
          }
        ),
      ]);
      if (studentData && !("error" in studentData)) setStudent(studentData);
      setAnalysis(analysisData?.id ? analysisData : null);
      setTemperatureHistory(Array.isArray(tempData) ? tempData : []);
    })();
  }, [id]);

  if (!student) {
    return (
      <div className="flex h-full min-h-0 flex-1 overflow-hidden">
        <div className="hidden h-full w-[260px] shrink-0 border-r border-border lg:block">
          <StudentList selectedId={id} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-background">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
          <p className="text-sm text-foreground-muted">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden">
      <div className="hidden h-full w-[260px] shrink-0 border-r border-border lg:block">
        <StudentList selectedId={id} />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <div className="shrink-0">
          <StudentKarte student={student} />
          <div className="border-b border-border-subtle px-4 py-3 lg:px-6">
            <PortalContextBar student={student} variant="admin-on-student" />
          </div>
          <div className="flex items-center justify-end gap-2 border-b border-border-subtle px-4 py-2 lg:hidden">
            <Link
              href={`/interviews/upload?studentId=${id}`}
              className={buttonClass("primary", "sm")}
            >
              <Mic className="h-3.5 w-3.5" />
              面談追加
            </Link>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <StudentTabs
            student={student}
            analysis={analysis}
            temperatureHistory={temperatureHistory}
            onStudentUpdate={setStudent}
            interviewRefreshKey={interviewRefreshKey}
            onAnalysisSaved={(saved) => {
              setAnalysis(saved);
              setInterviewRefreshKey((k) => k + 1);
            }}
          />
        </div>
      </div>

      <div className="hidden h-full w-[340px] shrink-0 bg-background-subtle lg:block">
        <div className="flex h-full min-h-0 flex-col border-l border-border">
          <div className="shrink-0 border-b border-border bg-background px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
              CAアシスタント
            </p>
            <Link
              href={`/interviews/upload?studentId=${id}`}
              className={`mt-3 w-full ${buttonClass("primary", "md")}`}
            >
              <Mic className="h-4 w-4" />
              面談をアップロード
            </Link>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <AnalysisPanel
              analysis={analysis}
              student={student}
              temperatureHistory={temperatureHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
