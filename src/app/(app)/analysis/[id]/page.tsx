"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InterviewAnalysisReport } from "@/components/interviews/InterviewAnalysisReport";
import { PortalContextBar } from "@/components/shared/PortalContextBar";
import { useAuth } from "@/lib/auth/auth-context";
import { fetchJson } from "@/lib/api/fetch-json";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import type { InterviewRecord, Student } from "@/lib/data/types";

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { session } = useAuth();
  const isAdmin = session?.role === "admin";
  const [record, setRecord] = useState<InterviewRecord | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await fetchJson<InterviewRecord | null>(
        `/api/ca/interview-records/${id}`,
        {
          fallback: () => clientMockFallback.interviewRecord(id),
          allowNull: true,
        }
      );
      if (data && !("error" in (data as object))) {
        setRecord(data);
        const s = await fetchJson<Student | null>(
          `/api/students/${data.analysis.studentId}`,
          {
            fallback: () => clientMockFallback.student(data.analysis.studentId),
            allowNull: true,
          }
        );
        if (s && !("error" in (s as object))) setStudent(s);
      }
    })();
  }, [id]);

  const backHref = isAdmin
    ? student
      ? `/students/${student.id}`
      : "/students"
    : student
      ? `/ca/interviews?studentId=${student.id}`
      : "/ca/interviews";

  const backLabel = isAdmin ? "学生カルテに戻る" : "面談入力に戻る";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="shrink-0 border-b border-border bg-white px-5 py-4 lg:px-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
        <p className="mt-2 text-xs text-foreground-muted">
          {isAdmin ? "代表 · 面談AIレポート" : "CA Portal · 面談AIレポート"}
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-area">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-4xl lg:px-8 lg:py-8">
          {student && (
            <PortalContextBar
              student={student}
              variant={isAdmin ? "admin-on-student" : "ca-on-student"}
              className="mb-6"
            />
          )}

          {!record ? (
            <p className="py-16 text-center text-sm text-foreground-muted">
              読み込み中…
            </p>
          ) : (
            <InterviewAnalysisReport
              analysis={record.analysis}
              student={student}
              transcript={record.interview.transcript}
              saved
            />
          )}
        </div>
      </div>
    </div>
  );
}
