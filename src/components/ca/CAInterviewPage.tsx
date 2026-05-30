"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileAudio, User, FileText } from "lucide-react";
import { AudioUploader } from "@/components/interviews/AudioUploader";
import { ProcessingState } from "@/components/interviews/ProcessingState";
import { InterviewAnalysisReport } from "@/components/interviews/InterviewAnalysisReport";
import { CAInterviewSavedList } from "@/components/ca/CAInterviewSavedList";
import { InterviewMemoSection } from "@/components/students/InterviewMemoSection";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { fetchJson } from "@/lib/api/fetch-json";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { safeJson } from "@/lib/utils/safe-json";
import type { AIAnalysis, InterviewRecord, Student } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

type Step = "idle" | "uploading" | "transcribing" | "analyzing" | "done" | "error";
type Mode = "audio" | "memo";

function CAInterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useAuth();
  const effectiveCaId = session?.caId ?? "";
  const preselectedId = searchParams.get("studentId") ?? "";
  const viewId = searchParams.get("view") ?? "";

  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState(preselectedId);
  const [mode, setMode] = useState<Mode>("memo");
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const loadSavedRecord = useCallback(async (analysisId: string) => {
    const data = await fetchJson<InterviewRecord | null>(
      `/api/ca/interview-records/${analysisId}`,
      {
        fallback: () => clientMockFallback.interviewRecord(analysisId),
        allowNull: true,
      }
    );
    if (data && !("error" in (data as object))) {
      setAnalysis(data.analysis);
      setTranscript(data.interview.transcript);
      setStep("done");
    }
  }, []);

  useEffect(() => {
    if (viewId) void loadSavedRecord(viewId);
  }, [viewId, loadSavedRecord]);

  useEffect(() => {
    const url = effectiveCaId ? `/api/students?caId=${effectiveCaId}` : "/api/students";
    void fetchJson<Student[]>(url, {
      fallback: async () => {
        const all = await clientMockFallback.students();
        return effectiveCaId
          ? all.filter((s) => s.assignedCaId === effectiveCaId)
          : all;
      },
    }).then(setStudents);
  }, [effectiveCaId]);

  useEffect(() => {
    if (preselectedId) setStudentId(preselectedId);
  }, [preselectedId]);

  const handleStudentChange = (id: string) => {
    setStudentId(id);
    setStep("idle");
    setAnalysis(null);
    setTranscript("");
    setFile(null);
    setError("");
    router.replace(id ? `/ca/interviews?studentId=${id}` : "/ca/interviews");
  };

  const handleUpload = async () => {
    if (!file || !studentId) {
      setError("学生と音声を選択してください");
      setStep("error");
      return;
    }
    setError("");
    setStep("uploading");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", studentId);
    try {
      setStep("transcribing");
      setStep("analyzing");
      const res = await fetch("/api/interviews/upload", { method: "POST", body: formData });
      const data = await safeJson<{
        transcript?: string;
        analysis?: AIAnalysis;
        error?: string;
      }>(res);
      if (!res.ok || !data?.analysis) throw new Error(data?.error ?? "失敗");
      setTranscript(data.transcript ?? "");
      setAnalysis(data.analysis);
      setStep("done");
      setHistoryKey((k) => k + 1);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      setStep("error");
      setError(err instanceof Error ? err.message : "処理に失敗しました");
    }
  };

  const isProcessing = !["idle", "error", "done"].includes(step);
  const selectedStudent = students.find((s) => s.id === studentId);
  const showReport = step === "done" && analysis;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-2 lg:px-8">
      <div className="lg:grid lg:grid-cols-5 lg:gap-8 lg:items-start">
        {/* 入力 */}
        <div className="space-y-4 lg:col-span-2">
          <Card padding="md">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-foreground-muted" />
              学生
            </label>
            <Select
              value={studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              disabled={isProcessing}
            >
              <option value="">選択</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}（{s.university}）
                </option>
              ))}
            </Select>
          </Card>

          {studentId && (
            <>
              <div className="flex rounded-lg border border-border p-1">
                {(
                  [
                    ["memo", "メモ", FileText],
                    ["audio", "録音", FileAudio],
                  ] as const
                ).map(([m, label, Icon]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium",
                      mode === m ? "bg-white shadow-xs" : "text-foreground-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              {mode === "memo" && selectedStudent ? (
                <InterviewMemoSection
                  student={selectedStudent}
                  embedded
                  onSaved={(saved) => {
                    setHistoryKey((k) => k + 1);
                    router.push(`/analysis/${saved.id}`);
                  }}
                />
              ) : (
                <Card padding="md" className="space-y-4">
                  {step === "idle" || step === "error" ? (
                    <>
                      <AudioUploader
                        onFileSelect={(f) => {
                          setFile(f);
                          if (step === "error") setStep("idle");
                        }}
                        disabled={isProcessing}
                      />
                      {error && step === "error" && (
                        <p className="text-sm text-danger">{error}</p>
                      )}
                      <Button
                        onClick={handleUpload}
                        disabled={!file}
                        size="lg"
                        className="w-full"
                      >
                        解析して保存
                      </Button>
                    </>
                  ) : (
                    <ProcessingState step={step === "done" ? "done" : step} />
                  )}
                </Card>
              )}

              <CAInterviewSavedList
                key={historyKey}
                studentId={studentId}
                students={students}
                selectedAnalysisId={analysis?.id}
                onSelect={(record) => {
                  setAnalysis(record.analysis);
                  setTranscript(record.interview.transcript);
                  setStep("done");
                  router.replace(
                    `/ca/interviews?studentId=${studentId}&view=${record.analysis.id}`,
                    { scroll: false }
                  );
                }}
                compact
              />
            </>
          )}
        </div>

        {/* 結果 */}
        <div ref={resultsRef} className="mt-8 lg:col-span-3 lg:mt-0">
          {!studentId ? (
            <p className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-foreground-muted">
              学生を選ぶと、ここに解析結果が表示されます
            </p>
          ) : showReport ? (
            <div className="space-y-3">
              <div className="flex justify-end">
                <Link
                  href={`/analysis/${analysis.id}`}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  全画面で見る →
                </Link>
              </div>
              <InterviewAnalysisReport
                analysis={analysis}
                student={selectedStudent}
                transcript={transcript}
                saved
              />
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-foreground-muted">
              面談を記録して「解析して保存」すると表示されます
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function CAInterviewPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-foreground-muted">読み込み中…</p>}>
      <CAInterviewContent />
    </Suspense>
  );
}
