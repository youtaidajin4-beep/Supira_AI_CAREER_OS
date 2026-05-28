import { FileText } from "lucide-react";
import type { AIAnalysis, Student } from "@/lib/data/types";
import { AnalysisCard, TagList } from "./AnalysisCard";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/cn";

interface AnalysisPanelProps {
  analysis: AIAnalysis | null;
  student?: Student | null;
  compact?: boolean;
}

export function AnalysisPanel({
  analysis,
  student,
  compact,
}: AnalysisPanelProps) {
  if (!analysis) {
    return (
      <EmptyState
        icon={FileText}
        title="分析レポートはまだありません"
        description="面談履歴タブでメモを保存するか、音声をアップロードすると分析が表示されます"
        className="h-full min-h-[200px]"
      />
    );
  }

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
          分析レポート
        </h3>
        <p className="mt-0.5 text-xs text-foreground-muted">
          最新の面談分析
          <span className="mx-1.5 text-border">·</span>
          温度感{" "}
          <span className="font-medium text-foreground-secondary">
            {analysis.temperatureScore}
          </span>
        </p>
      </div>

      <AnalysisCard title="要約" variant="highlight">
        {analysis.summary}
      </AnalysisCard>
      <AnalysisCard title="学生特徴">{analysis.personality}</AnalysisCard>
      <AnalysisCard title="強み">
        <TagList items={analysis.strengths} />
      </AnalysisCard>
      <AnalysisCard title="弱み・改善点">
        <TagList items={analysis.weaknesses} />
      </AnalysisCard>
      <AnalysisCard title="志向性">{analysis.orientation}</AnalysisCard>
      <AnalysisCard title="不安点">
        <TagList items={analysis.anxiety} />
      </AnalysisCard>
      <AnalysisCard title="次回聞くべきこと">
        <TagList items={analysis.nextActions} />
      </AnalysisCard>
      {analysis.recommendedCompanies.length > 0 && (
        <AnalysisCard title="おすすめ企業タイプ">
          <TagList items={analysis.recommendedCompanies} />
        </AnalysisCard>
      )}
      {(student?.temperature === "at_risk" || student?.riskReason) && (
        <AnalysisCard title="離脱リスク" variant="highlight">
          <p>{student?.riskReason || analysis.temperatureAnalysis}</p>
        </AnalysisCard>
      )}
      <AnalysisCard title="温度感分析">
        <span className="font-medium text-foreground">
          {analysis.temperatureScore}
        </span>
        <p className="mt-2">{analysis.temperatureAnalysis}</p>
      </AnalysisCard>
      {analysis.caRecommendedActions &&
        analysis.caRecommendedActions.length > 0 && (
          <AnalysisCard title="次にCAがやるべきこと">
            <TagList items={analysis.caRecommendedActions} />
          </AnalysisCard>
        )}
      {analysis.executiveNotes && (
        <AnalysisCard title="福与さんが確認すべきこと" variant="highlight">
          {analysis.executiveNotes}
        </AnalysisCard>
      )}
      <div className="h-4 shrink-0" aria-hidden />
    </div>
  );
}
