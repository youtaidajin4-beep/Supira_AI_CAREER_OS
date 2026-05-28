"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { AIAnalysis, Student, TemperatureSnapshot } from "@/lib/data/types";
import { AnalysisCard, TagList } from "./AnalysisCard";
import { EmptyState } from "@/components/ui/empty-state";
import { TemperatureTrend } from "@/components/shared/TemperatureTrend";
import { TemperatureBadge } from "@/components/students/TemperatureBadge";
import { hasTemperatureDropped } from "@/lib/temperature/score";
import { cn } from "@/lib/utils/cn";

interface AnalysisPanelProps {
  analysis: AIAnalysis | null;
  student?: Student | null;
  temperatureHistory?: TemperatureSnapshot[];
  compact?: boolean;
}

function needsExecutiveIntervention(student: Student): boolean {
  return (
    student.temperature === "at_risk" ||
    student.unreadDays >= 14 ||
    (student.temperature === "low" && student.unreadDays >= 7)
  );
}

export function AnalysisPanel({
  analysis,
  student,
  temperatureHistory = [],
  compact,
}: AnalysisPanelProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!student && !analysis) {
    return (
      <EmptyState
        icon={FileText}
        title="判断サマリーはまだありません"
        description="面談記録または分析データがあると表示されます"
        className="h-full min-h-[200px]"
      />
    );
  }

  const dropped =
    student &&
    hasTemperatureDropped(student.temperature, temperatureHistory);
  const intervene = student ? needsExecutiveIntervention(student) : false;

  return (
    <div
      className={cn(
        "h-full space-y-3 scroll-area scroll-smooth",
        compact
          ? "overflow-y-auto overscroll-y-contain p-4"
          : "overflow-y-auto overscroll-y-contain p-5"
      )}
    >
      <div className="sticky top-0 z-[1] -mx-1 rounded-xl bg-background-subtle/95 px-1 py-3 backdrop-blur-sm">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          判断サマリー
        </h3>
        <p className="mt-0.5 text-xs text-foreground-muted">
          代表・CA向けの要点
        </p>
      </div>

      {student && (
        <>
          <AnalysisCard title="学生タイプ / 志向">
            <p className="text-sm">
              {analysis?.personality || "—"}
            </p>
            <p className="mt-2 text-sm text-foreground-secondary">
              {analysis?.orientation || student.industry}
            </p>
          </AnalysisCard>

          <AnalysisCard title="温度感">
            <div className="flex flex-wrap items-center gap-2">
              <TemperatureBadge temperature={student.temperature} />
              {dropped && (
                <span className="rounded-md bg-warning-subtle px-2 py-0.5 text-[10px] font-medium text-warning">
                  最近下降
                </span>
              )}
            </div>
            {temperatureHistory.length > 0 && (
              <div className="mt-3">
                <TemperatureTrend history={temperatureHistory} />
              </div>
            )}
          </AnalysisCard>

          <AnalysisCard
            title="離脱リスク / 不安"
            variant={
              student.temperature === "at_risk" ? "highlight" : undefined
            }
          >
            <p className="text-sm">
              {student.riskReason ||
                (student.temperature === "at_risk"
                  ? "離脱リスクが高い状態です"
                  : "現時点で重大な離脱シグナルは限定的です")}
            </p>
            {analysis?.anxiety && analysis.anxiety.length > 0 && (
              <div className="mt-2">
                <TagList items={analysis.anxiety} />
              </div>
            )}
          </AnalysisCard>

          {analysis?.recommendedCompanies &&
            analysis.recommendedCompanies.length > 0 && (
              <AnalysisCard title="向いている企業タイプ">
                <TagList items={analysis.recommendedCompanies} />
              </AnalysisCard>
            )}

          {analysis?.caRecommendedActions &&
            analysis.caRecommendedActions.length > 0 && (
              <AnalysisCard title="CA推奨行動">
                <TagList items={analysis.caRecommendedActions} />
              </AnalysisCard>
            )}

          <AnalysisCard
            title="福与さんが介入すべきか"
            variant={intervene ? "highlight" : undefined}
          >
            <p
              className={cn(
                "text-sm font-medium",
                intervene ? "text-warning" : "text-success"
              )}
            >
              {intervene ? "はい — 代表フォローを推奨" : "いいえ — CA主導で継続"}
            </p>
            {(analysis?.executiveNotes || student.riskReason) && (
              <p className="mt-2 text-xs leading-relaxed text-foreground-secondary">
                {analysis?.executiveNotes || student.riskReason}
              </p>
            )}
          </AnalysisCard>
        </>
      )}

      {analysis && (
        <>
          <button
            type="button"
            onClick={() => setDetailsOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground-secondary hover:bg-background-subtle"
          >
            分析レポート詳細
            {detailsOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          {detailsOpen && (
            <div className="space-y-3">
              <AnalysisCard title="要約" variant="highlight">
                {analysis.summary}
              </AnalysisCard>
              <AnalysisCard title="強み">
                <TagList items={analysis.strengths} />
              </AnalysisCard>
              <AnalysisCard title="弱み・改善点">
                <TagList items={analysis.weaknesses} />
              </AnalysisCard>
              <AnalysisCard title="温度感分析">
                {analysis.temperatureAnalysis}
              </AnalysisCard>
            </div>
          )}
        </>
      )}

      {!analysis && student && (
        <p className="text-xs text-foreground-muted">
          面談分析レポートは未作成です。上記は学生データからの判断サマリーです。
        </p>
      )}

      <div className="h-4 shrink-0" aria-hidden />
    </div>
  );
}
