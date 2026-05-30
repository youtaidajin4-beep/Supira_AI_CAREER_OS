"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { ArrowLeft, Mic, Sparkles } from "lucide-react";
import type { AIAnalysis, Student } from "@/lib/data/types";
import { STATUS_LABELS, TEMPERATURE_LABELS } from "@/lib/data/types";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { StudentTimeline } from "@/components/students/StudentTimeline";
import { CAAssistantPanel } from "@/components/ca/CAAssistantPanel";
import { PortalContextBar } from "@/components/shared/PortalContextBar";
import { CAScrollPane } from "@/components/ca/CAScrollPane";
import { buttonClass } from "@/components/ui/button";
import { fetchJson } from "@/lib/api/fetch-json";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";

interface CAStudentDetailViewProps {
  studentId: string;
}

function AISummaryBlock({ analysis }: { analysis: AIAnalysis | null }) {
  if (!analysis) {
    return (
      <p className="text-sm text-foreground-muted">
        面談記録後にAIサマリーが表示されます
      </p>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="text-[11px] font-semibold uppercase text-foreground-muted">
          強み
        </p>
        <ul className="mt-1 list-inside list-disc text-foreground-secondary">
          {analysis.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase text-foreground-muted">
          不安
        </p>
        <ul className="mt-1 list-inside list-disc text-foreground-secondary">
          {(analysis.anxiety.length ? analysis.anxiety : ["—"]).map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase text-foreground-muted">
          志向性
        </p>
        <p className="mt-1 text-foreground-secondary">{analysis.orientation}</p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase text-foreground-muted">
          推奨アクション
        </p>
        <ul className="mt-1 space-y-1 text-foreground-secondary">
          {(analysis.nextActions.length
            ? analysis.nextActions
            : analysis.caRecommendedActions ?? ["面談後に次アクションを設定"]
          ).map((a) => (
            <li key={a} className="rounded-md bg-white px-2 py-1.5 text-xs">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CAStudentDetailView({ studentId }: CAStudentDetailViewProps) {
  const router = useRouter();
  const { session } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    void (async () => {
      const [s, a] = await Promise.all([
        fetchJson<Student | null>(`/api/students/${studentId}`, {
          fallback: () => clientMockFallback.student(studentId),
          allowNull: true,
        }),
        fetchJson<AIAnalysis | null>(`/api/analysis?studentId=${studentId}`, {
          fallback: () => clientMockFallback.analysis(studentId),
          allowNull: true,
        }),
      ]);
      if (s && !("error" in s)) {
        if (
          session?.role === "ca" &&
          session.caId &&
          s.assignedCaId !== session.caId
        ) {
          setDenied(true);
          return;
        }
        setStudent(s);
      }
      setAnalysis(a?.id ? a : null);
    })();
  }, [studentId, session?.role, session?.caId]);

  if (denied) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-sm text-foreground-muted">
          この学生はあなたの担当外です
        </p>
        <button
          type="button"
          onClick={() => router.push("/ca/students")}
          className="text-sm font-medium text-accent"
        >
          担当学生一覧へ
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-foreground-muted">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border bg-white px-5 py-4 lg:px-6">
          <Link
            href="/ca/students"
            className="mb-3 inline-flex items-center gap-1 text-xs text-foreground-muted hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            担当学生一覧
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{student.name}</h1>
              <p className="mt-1 text-sm text-foreground-muted">
                {student.university} · {student.grade}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <TemperatureBadge temperature={student.temperature} />
                <span className="rounded-md bg-background-subtle px-2 py-0.5 text-xs text-foreground-secondary">
                  {STATUS_LABELS[student.status]}
                </span>
                <span className="text-xs text-foreground-muted">
                  温度感: {TEMPERATURE_LABELS[student.temperature]}
                </span>
              </div>
            </div>
            <Link
              href={`/ca/interviews?studentId=${student.id}`}
              className={buttonClass("primary", "md")}
            >
              <Mic className="h-4 w-4" />
              面談を記録
            </Link>
          </div>
          <div className="mt-4">
            <PortalContextBar student={student} variant="ca-on-student" />
          </div>
        </div>

        <CAScrollPane>
          <div className="p-5 lg:p-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-6">
              <section>
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                  タイムライン
                </h2>
                <StudentTimeline studentId={student.id} />
              </section>

              <section className="rounded-xl border border-border bg-background-subtle/30 p-4 lg:border-0 lg:bg-transparent lg:p-0">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-foreground">
                    AIサマリー
                  </h2>
                  {analysis && (
                    <Link
                      href={`/analysis/${analysis.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      詳細レポート
                    </Link>
                  )}
                </div>
                <AISummaryBlock analysis={analysis} />
              </section>
            </div>
          </div>
        </CAScrollPane>
      </div>

      <div className="hidden h-full min-h-0 w-[300px] shrink-0 xl:block">
        <CAAssistantPanel studentName={student.name} />
      </div>
    </div>
  );
}
