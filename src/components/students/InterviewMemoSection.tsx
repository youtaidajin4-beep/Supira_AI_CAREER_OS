"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import type { AIAnalysis, Student } from "@/lib/data/types";
import type { MemoAnalysisResult } from "@/lib/ai/schemas";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnalysisCard, TagList } from "@/components/ai/AnalysisCard";
import { CAInterviewAnalysisReveal } from "@/components/ca/CAInterviewAnalysisReveal";
import { safeJson } from "@/lib/utils/safe-json";
import { cn } from "@/lib/utils/cn";

function memoPreviewToAnalysis(
  preview: MemoAnalysisResult,
  studentId: string
): AIAnalysis {
  return {
    id: "preview",
    studentId,
    summary: preview.summary,
    personality: preview.personality,
    strengths: preview.strengths,
    weaknesses: preview.weaknesses,
    orientation: preview.orientation,
    anxiety: preview.anxiety,
    nextActions: preview.nextActions,
    recommendedCompanies:
      preview.recommendedCompanies ?? preview.insights.companyFit.bestTypes,
    caRecommendedActions: preview.caRecommendedActions,
    temperatureAnalysis: preview.temperatureAnalysis,
    temperatureScore: preview.temperatureScore,
    insights: preview.insights,
    executiveNotes: preview.insights.wowInsight,
    createdAt: new Date().toISOString(),
  };
}

type Step = "idle" | "generating" | "preview" | "saving" | "saved" | "error";

interface InterviewMemoSectionProps {
  student: Student;
  onSaved: (analysis: AIAnalysis) => void;
  /** 面談履歴タブ内に埋め込む場合 */
  embedded?: boolean;
}

export function InterviewMemoSection({
  student,
  onSaved,
  embedded = false,
}: InterviewMemoSectionProps) {
  const [collapsed, setCollapsed] = useState(!embedded);
  const [memo, setMemo] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<MemoAnalysisResult | null>(null);

  const handleGenerate = async () => {
    const trimmed = memo.trim();
    if (trimmed.length < 10) {
      setError("面談メモは10文字以上で入力してください");
      setStep("error");
      setCollapsed(false);
      return;
    }

    setError("");
    setStep("generating");
    setPreview(null);
    setCollapsed(false);

    try {
      const res = await fetch("/api/ai/analyze-memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student.id, memo: trimmed }),
      });

      const data = await safeJson<MemoAnalysisResult & { error?: string }>(res);

      if (!res.ok || !data) {
        throw new Error(data?.error ?? "AI要約の生成に失敗しました");
      }

      setPreview(data as MemoAnalysisResult);
      setStep("preview");
    } catch (err) {
      setStep("error");
      setError(
        err instanceof Error ? err.message : "AI要約の生成に失敗しました"
      );
    }
  };

  const handleSave = async () => {
    if (!preview) return;

    setStep("saving");
    setError("");

    try {
      const res = await fetch("/api/interviews/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          memo: memo.trim(),
          analysis: preview,
        }),
      });

      const data = await safeJson<{ analysis?: AIAnalysis; error?: string }>(res);

      if (!res.ok || !data?.analysis) {
        throw new Error(data?.error ?? "保存に失敗しました");
      }

      setStep("saved");
      onSaved(data.analysis);

      setTimeout(() => {
        setMemo("");
        setPreview(null);
        setStep("idle");
        setCollapsed(true);
      }, 2000);
    } catch (err) {
      setStep("error");
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    }
  };

  const isBusy = step === "generating" || step === "saving";

  const wrapperClass = embedded ? "space-y-4" : undefined;
  const Wrapper = embedded ? "div" : Card;
  const wrapperProps = embedded
    ? { className: wrapperClass }
    : { padding: "md" as const, className: cn("mx-4 lg:mx-6") };

  return (
    <Wrapper {...wrapperProps}>
      {!embedded && (
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              面談メモを追加
            </h3>
            <p className="mt-0.5 text-xs text-foreground-muted">
              {collapsed
                ? "タップしてメモ入力・AI要約"
                : "面談後のメモからAI要約を生成し、カルテに保存"}
            </p>
          </div>
          {collapsed ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-foreground-muted" />
          ) : (
            <ChevronUp className="h-4 w-4 shrink-0 text-foreground-muted" />
          )}
        </button>
      )}

      {(embedded || !collapsed) && (
        <div className="mt-4 space-y-4 border-t border-border-subtle pt-4">
          <Textarea
            label="面談メモ"
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value);
              if (step === "error") setStep("idle");
            }}
            rows={4}
            placeholder="面談で話した内容、学生の様子、気づいたことなど..."
            disabled={isBusy}
          />

          {step === "generating" && (
            <div className="flex items-center gap-2.5 rounded-lg border border-accent/20 bg-accent-subtle/50 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              <p className="text-sm text-accent">
                AIが面談内容を整理しています…
              </p>
            </div>
          )}

          {step === "error" && error && (
            <div className="rounded-lg border border-danger/25 bg-danger-subtle px-4 py-3">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {step === "saved" && (
            <div className="rounded-lg border border-success/30 bg-success-subtle px-4 py-3">
              <p className="text-sm font-medium text-success">
                学生カルテに保存しました
              </p>
            </div>
          )}

          {preview &&
            (step === "preview" || step === "saving" || step === "saved") &&
            (embedded ? (
              <CAInterviewAnalysisReveal
                analysis={memoPreviewToAnalysis(preview, student.id)}
                student={student}
                transcript={memo.trim()}
              />
            ) : (
              <div className="max-h-[min(50vh,400px)] space-y-3 overflow-y-auto overscroll-y-contain rounded-xl border border-border bg-background-subtle/50 p-4 scroll-area scroll-smooth">
                <p className="sticky top-0 bg-background-subtle/95 pb-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted backdrop-blur-sm">
                  生成結果のプレビュー
                </p>
                <AnalysisCard title="面談要約" variant="highlight">
                  {preview.summary}
                </AnalysisCard>
                <AnalysisCard title="強み">
                  <TagList items={preview.strengths} />
                </AnalysisCard>
                <AnalysisCard title="弱み">
                  <TagList items={preview.weaknesses} />
                </AnalysisCard>
                <AnalysisCard title="志向性">{preview.orientation}</AnalysisCard>
                <AnalysisCard title="不安点">
                  <TagList items={preview.anxiety} />
                </AnalysisCard>
                <AnalysisCard title="次回聞くべきこと">
                  <TagList items={preview.nextActions} />
                </AnalysisCard>
                <AnalysisCard title="温度感">
                  <span className="font-medium text-foreground">
                    {preview.temperatureScore}
                  </span>
                  <p className="mt-2">{preview.temperatureAnalysis}</p>
                </AnalysisCard>
                <AnalysisCard title="CAへの推奨アクション">
                  <TagList
                    items={
                      preview.caRecommendedActions ??
                      preview.insights.caPlaybook.doToday
                    }
                  />
                </AnalysisCard>
              </div>
            ))}

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isBusy || !memo.trim()}
              variant="primary"
            >
              {step === "generating" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  AI要約を生成
                </>
              )}
            </Button>

            {preview && (step === "preview" || step === "saving") && (
              <Button
                onClick={handleSave}
                disabled={isBusy}
                variant="secondary"
              >
                {step === "saving" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  "学生カルテに保存"
                )}
              </Button>
            )}

            {preview && step !== "generating" && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setStep("idle");
                  setError("");
                }}
                className="h-9 px-3 text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                破棄
              </button>
            )}
          </div>
        </div>
      )}
    </Wrapper>
  );
}
