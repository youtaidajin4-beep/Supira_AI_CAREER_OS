"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import type { AIAnalysis, Student } from "@/lib/data/types";
import { resolveInterviewInsights } from "@/lib/ai/interview-insights";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { cn } from "@/lib/utils/cn";
import type { Temperature } from "@/lib/data/types";
import { formatDateTime } from "@/lib/utils/dates";

type TabId = "action" | "student" | "detail";

interface InterviewAnalysisReportProps {
  analysis: AIAnalysis;
  student?: Student | null;
  transcript?: string;
  saved?: boolean;
  className?: string;
}

function tempFromScore(score: string): Temperature {
  const t = score.toLowerCase();
  if (t.includes("高")) return "high";
  if (t.includes("離脱") || t.includes("リスク")) return "at_risk";
  if (t.includes("低")) return "low";
  return "medium";
}

const TABS: { id: TabId; label: string }[] = [
  { id: "action", label: "今日やること" },
  { id: "student", label: "学生理解" },
  { id: "detail", label: "就活・面接" },
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-2 text-sm leading-relaxed text-foreground-secondary"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function InterviewAnalysisReport({
  analysis,
  student,
  transcript,
  saved,
  className,
}: InterviewAnalysisReportProps) {
  const [tab, setTab] = useState<TabId>("action");
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const insights = resolveInterviewInsights(analysis, student);

  const copyLine = async () => {
    try {
      await navigator.clipboard.writeText(insights.caPlaybook.lineDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={cn("rounded-xl border border-border bg-white", className)}>
      {/* ヘッダー — 要点だけ */}
      <header className="border-b border-border-subtle px-5 py-4 lg:px-6 lg:py-5">
        {saved && (
          <p className="mb-2 text-xs font-medium text-success">
            ✓ 保存済み — いつでもこのページから開けます
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <TemperatureBadge temperature={tempFromScore(analysis.temperatureScore)} />
          <span className="rounded-md bg-background-subtle px-2 py-0.5 text-xs text-foreground-muted">
            面接準備 {insights.interviewReadiness.score}点
          </span>
          <span className="rounded-md bg-background-subtle px-2 py-0.5 text-xs text-foreground-muted">
            ガクチカ深さ {insights.gakuchika.depthScore}/5
          </span>
        </div>
        <h2 className="mt-3 text-lg font-semibold leading-snug text-foreground lg:text-xl">
          {insights.sessionHeadline}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
          {insights.wowInsight}
        </p>
        <p className="mt-2 text-xs text-foreground-muted">
          {formatDateTime(analysis.createdAt)}
          {student ? ` · ${student.name}（${student.university}）` : ""}
        </p>
      </header>

      {/* タブ */}
      <div className="flex border-b border-border-subtle px-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 border-b-2 px-3 py-3 text-center text-sm font-medium transition-colors",
              tab === t.id
                ? "border-accent text-accent"
                : "border-transparent text-foreground-muted hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-5 py-5 lg:px-6 lg:py-6">
        {tab === "action" && (
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-foreground">今日やること</h3>
              <div className="mt-3 space-y-2">
                {insights.caPlaybook.doToday.map((item, i) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-lg border border-border bg-background-subtle/50 px-4 py-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground-secondary">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">LINE下書き</h3>
                <button
                  type="button"
                  onClick={() => void copyLine()}
                  className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      コピー済み
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      コピー
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 rounded-lg border border-border bg-background-subtle/30 p-4 text-sm leading-relaxed text-foreground-secondary">
                {insights.caPlaybook.lineDraft}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-foreground">次回面談で話すこと</h3>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-foreground-secondary">
                {insights.caPlaybook.nextMeetingAgenda.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          </div>
        )}

        {tab === "student" && (
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-foreground">面談要約</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                {analysis.summary}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-foreground">
                学生タイプ — {insights.studentType.label}
              </h3>
              <p className="mt-1 text-sm text-foreground-secondary">
                {insights.studentType.oneLiner}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-foreground">本音（キークォート）</h3>
              <div className="mt-3 space-y-3">
                {insights.keyQuotes.map((q) => (
                  <blockquote
                    key={q.quote}
                    className="border-l-2 border-accent pl-3 text-sm italic text-foreground"
                  >
                    {q.quote}
                    <footer className="mt-1 text-xs not-italic text-foreground-muted">
                      {q.meaning}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <section>
                <h3 className="text-sm font-semibold text-foreground">強み</h3>
                <BulletList items={analysis.strengths} />
              </section>
              <section>
                <h3 className="text-sm font-semibold text-foreground">伸びしろ</h3>
                <BulletList items={analysis.weaknesses} />
              </section>
            </div>
          </div>
        )}

        {tab === "detail" && (
          <div className="space-y-6">
            <section className="grid gap-3 sm:grid-cols-3">
              {[
                ["就活フェーズ", insights.jobHuntSnapshot.phase],
                ["ES", insights.jobHuntSnapshot.esStatus],
                ["選考", insights.jobHuntSnapshot.selectionStatus],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-border-subtle bg-background-subtle/40 px-3 py-2.5"
                >
                  <p className="text-[11px] font-medium text-foreground-muted">{label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
                </div>
              ))}
            </section>

            <section>
              <h3 className="text-sm font-semibold text-foreground">ガクチカ</h3>
              <p className="mt-2 text-sm text-foreground-secondary">
                {insights.gakuchika.episode}
              </p>
              <p className="mt-3 text-xs font-medium text-foreground-muted">深掘り質問案</p>
              <BulletList items={insights.gakuchika.gapsToProbe} />
            </section>

            <section>
              <h3 className="text-sm font-semibold text-foreground">面接対策</h3>
              <p className="mt-1 text-sm text-foreground-secondary">
                {insights.interviewReadiness.verdict}
              </p>
              <p className="mt-3 text-xs font-medium text-foreground-muted">練習テーマ</p>
              <BulletList items={insights.interviewReadiness.practiceTopics} />
            </section>

            {insights.riskSignals.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-foreground">注意点</h3>
                <ul className="mt-2 space-y-2">
                  {insights.riskSignals.map((r) => (
                    <li
                      key={r.signal}
                      className="rounded-lg border border-warning/25 bg-warning-subtle/30 px-3 py-2 text-sm"
                    >
                      <p className="font-medium text-foreground">{r.signal}</p>
                      <p className="mt-1 text-xs text-foreground-secondary">
                        → {r.caAction}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h3 className="text-sm font-semibold text-foreground">向いている企業タイプ</h3>
              <p className="mt-2 flex flex-wrap gap-1.5">
                {insights.companyFit.bestTypes.map((c) => (
                  <span
                    key={c}
                    className="rounded-md bg-accent-subtle px-2 py-0.5 text-xs text-accent"
                  >
                    {c}
                  </span>
                ))}
              </p>
            </section>
          </div>
        )}
      </div>

      {transcript && (
        <div className="border-t border-border-subtle">
          <button
            type="button"
            onClick={() => setTranscriptOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-3 text-sm text-foreground-muted hover:bg-background-subtle/50 lg:px-6"
          >
            文字起こし・メモ原文
            {transcriptOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {transcriptOpen && (
            <div className="max-h-48 overflow-y-auto border-t border-border-subtle px-5 py-3 text-xs leading-relaxed text-foreground-muted lg:px-6 scroll-area">
              {transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
