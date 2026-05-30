"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ChevronRight, Mic, FileText } from "lucide-react";
import { fetchJson } from "@/lib/api/fetch-json";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import type { InterviewRecord, Student } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";
import { formatDateTime } from "@/lib/utils/dates";

interface CAInterviewSavedListProps {
  studentId: string;
  students: Student[];
  selectedAnalysisId?: string | null;
  onSelect?: (record: InterviewRecord) => void;
  compact?: boolean;
}

export function CAInterviewSavedList({
  studentId,
  students,
  selectedAnalysisId,
  onSelect,
  compact = false,
}: CAInterviewSavedListProps) {
  const [records, setRecords] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const student = students.find((s) => s.id === studentId);

  useEffect(() => {
    if (!studentId) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    void fetchJson<InterviewRecord[]>(
      `/api/ca/interview-records?studentId=${studentId}`,
      {
        fallback: () => clientMockFallback.interviewRecords(studentId),
      }
    ).then((data) => {
      setRecords(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [studentId]);

  if (!studentId) return null;

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-white shadow-xs",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-accent" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold text-foreground">保存済みの解析</h3>
        </div>
        <span className="text-[11px] text-foreground-muted">
          {loading ? "…" : `${records.length}件`}
        </span>
      </div>

      {loading ? (
        <p className="py-4 text-center text-xs text-foreground-muted">読み込み中…</p>
      ) : records.length === 0 ? (
        <p className="py-4 text-center text-xs leading-relaxed text-foreground-muted">
          まだ保存された解析がありません。
          <br />
          面談後にAI解析するとここに残ります。
        </p>
      ) : (
        <ul className="space-y-2">
          {records.map((record) => {
            const headline =
              record.analysis.insights?.sessionHeadline ??
              record.analysis.summary.slice(0, 40) + "…";
            const isAudio = Boolean(record.interview.audioUrl);
            const active = selectedAnalysisId === record.analysis.id;

            const inner = (
              <>
                <div className="flex items-start gap-2">
                  <div
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      isAudio ? "bg-accent-subtle" : "bg-background-subtle"
                    )}
                  >
                    {isAudio ? (
                      <Mic className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 text-foreground-muted" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-foreground">
                      {headline}
                    </p>
                    <p className="mt-0.5 text-[11px] text-foreground-muted">
                      {formatDateTime(record.analysis.createdAt)}
                      {student ? ` · ${student.name}` : ""}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-accent" : "text-foreground-muted"
                    )}
                  />
                </div>
              </>
            );

            if (onSelect) {
              return (
                <li key={record.analysis.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(record)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                      active
                        ? "border-accent/40 bg-accent-subtle/50 ring-1 ring-accent/20"
                        : "border-border-subtle hover:border-accent/25 hover:bg-background-subtle/80"
                    )}
                  >
                    {inner}
                  </button>
                </li>
              );
            }

            return (
              <li key={record.analysis.id}>
                <Link
                  href={`/analysis/${record.analysis.id}`}
                  className={cn(
                    "block rounded-xl border px-3 py-2.5 transition-colors",
                    active
                      ? "border-accent/40 bg-accent-subtle/50"
                      : "border-border-subtle hover:border-accent/25 hover:bg-background-subtle/80"
                  )}
                >
                  {inner}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
