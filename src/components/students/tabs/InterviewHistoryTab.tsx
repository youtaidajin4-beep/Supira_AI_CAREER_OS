"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { AIAnalysis, Interview, Student } from "@/lib/data/types";
import { formatDateTime } from "@/lib/utils/dates";
import { InterviewMemoSection } from "@/components/students/InterviewMemoSection";
import { buttonClass } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface InterviewHistoryTabProps {
  student: Student;
  refreshKey?: number;
  onAnalysisSaved?: (analysis: AIAnalysis) => void;
}

export function InterviewHistoryTab({
  student,
  refreshKey = 0,
  onAnalysisSaved,
}: InterviewHistoryTabProps) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void fetchJson<Interview[]>(`/api/interviews?studentId=${student.id}`, {
      fallback: () => clientMockFallback.interviews(student.id),
    }).then((data) => {
      setInterviews(data);
      setLoading(false);
    });
  }, [student.id, refreshKey]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 lg:px-6 lg:py-6">
      <InterviewMemoSection
        student={student}
        embedded
        onSaved={(analysis) => onAnalysisSaved?.(analysis)}
      />

      <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground">面談履歴</h4>
          <p className="mt-0.5 text-xs text-foreground-muted">
            {loading ? "読み込み中" : `${interviews.length}件`}
          </p>
        </div>
        <Link
          href={`/interviews/upload?studentId=${student.id}`}
          className={buttonClass("secondary", "sm")}
        >
          <Plus className="h-3.5 w-3.5" />
          音声アップロード
        </Link>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="面談履歴がありません"
            description="上のフォームでメモを保存するか、音声をアップロードしてください"
            action={
              <Link
                href={`/interviews/upload?studentId=${student.id}`}
                className={buttonClass("primary", "md")}
              >
                面談をアップロード
              </Link>
            }
          />
        ) : (
          <div className="space-y-3 pb-6">
            {interviews.map((interview) => (
              <article
                key={interview.id}
                className="rounded-xl border border-border bg-background p-5 shadow-xs"
              >
                <time className="text-[11px] font-medium tabular-nums text-foreground-muted">
                  {formatDateTime(interview.createdAt)}
                </time>
                <p className="mt-2 text-sm font-medium leading-snug text-foreground">
                  {interview.summary}
                </p>
                {interview.analysisId ? (
                  <Link
                    href={`/analysis/${interview.analysisId}`}
                    className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                  >
                    AI解析レポートを見る →
                  </Link>
                ) : (
                  <p className="mt-3 line-clamp-2 text-xs text-foreground-muted">
                    {interview.transcript}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
