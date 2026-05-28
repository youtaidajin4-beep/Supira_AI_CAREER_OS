import type { AIAnalysis } from "@/lib/data/types";
import { AnalysisPanel } from "@/components/ai/AnalysisPanel";
import { Card } from "@/components/ui/card";

interface TranscriptPreviewProps {
  transcript: string;
  analysis: AIAnalysis;
}

export function TranscriptPreview({
  transcript,
  analysis,
}: TranscriptPreviewProps) {
  return (
    <div className="space-y-4">
      <Card padding="md">
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
          文字起こし
        </h4>
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground-secondary">
          {transcript}
        </p>
      </Card>
      <div className="rounded-xl border border-border bg-background-subtle">
        <AnalysisPanel analysis={analysis} compact />
      </div>
    </div>
  );
}
