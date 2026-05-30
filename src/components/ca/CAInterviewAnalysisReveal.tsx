import { InterviewAnalysisReport } from "@/components/interviews/InterviewAnalysisReport";
import type { AIAnalysis, Student } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

interface CAInterviewAnalysisRevealProps {
  analysis: AIAnalysis;
  student?: Student | null;
  transcript?: string;
  saved?: boolean;
  showDetailLink?: boolean;
  className?: string;
}

/** @deprecated Use InterviewAnalysisReport — kept for import compatibility */
export function CAInterviewAnalysisReveal(props: CAInterviewAnalysisRevealProps) {
  const { showDetailLink: _omit, className, ...rest } = props;
  return (
    <InterviewAnalysisReport
      className={cn("shadow-xs", className)}
      {...rest}
    />
  );
}
