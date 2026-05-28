"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileAudio, User } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { AudioUploader } from "@/components/interviews/AudioUploader";
import { ProcessingState } from "@/components/interviews/ProcessingState";
import { TranscriptPreview } from "@/components/interviews/TranscriptPreview";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { Button, buttonClass } from "@/components/ui/button";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import { safeJson } from "@/lib/utils/safe-json";
import type { AIAnalysis, Student } from "@/lib/data/types";

type Step = "idle" | "uploading" | "transcribing" | "analyzing" | "done" | "error";

function UploadContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("studentId") ?? "";

  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState(preselectedId);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  useEffect(() => {
    void fetchJson<Student[]>("/api/students", {
      fallback: () => clientMockFallback.students(),
    }).then(setStudents);
  }, []);

  useEffect(() => {
    if (preselectedId) setStudentId(preselectedId);
  }, [preselectedId]);

  const handleUpload = async () => {
    if (!file || !studentId) {
      setError("学生と音声ファイルを選択してください");
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
      await new Promise((r) => setTimeout(r, 300));
      setStep("analyzing");

      const res = await fetch("/api/interviews/upload", {
        method: "POST",
        body: formData,
      });

      const data = await safeJson<{
        transcript?: string;
        analysis?: AIAnalysis;
        error?: string;
      }>(res);

      if (!res.ok || !data) {
        throw new Error(data?.error ?? "Upload failed");
      }

      setTranscript(data.transcript ?? "");
      setAnalysis(data.analysis ?? null);
      setStep("done");
    } catch (err) {
      setStep("error");
      setError(err instanceof Error ? err.message : "処理に失敗しました");
    }
  };

  const isProcessing = step !== "idle" && step !== "error" && step !== "done";
  const selectedStudent = students.find((s) => s.id === studentId);

  return (
    <>
      <TopBar
        title="面談アップロード"
        description="録音から文字起こし・CA向け分析レポートを自動生成"
      />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain scroll-area scroll-smooth">
        <div className="mx-auto max-w-2xl space-y-6 p-6 lg:p-8">
          <Card padding="md">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-foreground-muted" strokeWidth={1.75} />
              <span className="text-sm font-medium text-foreground">対象学生</span>
            </div>
            <Select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={isProcessing}
            >
              <option value="">学生を選択してください</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}（{s.university}）
                </option>
              ))}
            </Select>
            {selectedStudent && (
              <p className="mt-2 text-xs text-foreground-muted">
                {selectedStudent.industry} · 担当 {selectedStudent.assignedCA}
              </p>
            )}
          </Card>

          {step === "idle" || step === "error" ? (
            <>
              <AudioUploader
                onFileSelect={(f) => {
                  setFile(f);
                  setError("");
                  if (step === "error") setStep("idle");
                }}
                disabled={isProcessing}
              />
              {file && (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background-subtle/50 px-4 py-3">
                  <FileAudio className="h-5 w-5 text-accent" strokeWidth={1.75} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              )}
              {step === "error" && error && (
                <ProcessingState step="error" error={error} />
              )}
              <Button
                onClick={handleUpload}
                disabled={!file || !studentId}
                size="lg"
                className="w-full"
              >
                アップロードして解析
              </Button>
            </>
          ) : (
            <>
              <ProcessingState step={step === "done" ? "done" : step} />
              {step === "done" && analysis && (
                <div className="space-y-4">
                  <TranscriptPreview
                    transcript={transcript}
                    analysis={analysis}
                  />
                  <div className="flex gap-3">
                    <Link
                      href={`/students/${studentId}`}
                      className={`flex-1 ${buttonClass("primary", "lg")}`}
                    >
                      学生カルテを見る
                    </Link>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="flex-1"
                      onClick={() => {
                        setStep("idle");
                        setFile(null);
                        setTranscript("");
                        setAnalysis(null);
                      }}
                    >
                      続けてアップロード
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function InterviewUploadPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-sm text-foreground-muted">読み込み中...</p>
        </div>
      }
    >
      <UploadContent />
    </Suspense>
  );
}
