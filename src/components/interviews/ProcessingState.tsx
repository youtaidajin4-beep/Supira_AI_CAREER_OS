import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ProcessingStep =
  | "uploading"
  | "transcribing"
  | "analyzing"
  | "done"
  | "error";

interface ProcessingStateProps {
  step: ProcessingStep;
  error?: string;
}

const steps: { key: ProcessingStep; label: string; desc: string }[] = [
  { key: "uploading", label: "アップロード", desc: "音声ファイルを送信" },
  { key: "transcribing", label: "文字起こし", desc: "Whisper で変換" },
  { key: "analyzing", label: "AI解析", desc: "面談内容を整理" },
  { key: "done", label: "完了", desc: "レポートを生成" },
];

const order: ProcessingStep[] = [
  "uploading",
  "transcribing",
  "analyzing",
  "done",
];

export function ProcessingState({ step, error }: ProcessingStateProps) {
  if (step === "error") {
    return (
      <div className="rounded-xl border border-danger/25 bg-danger-subtle p-5">
        <p className="text-sm font-medium text-danger">処理に失敗しました</p>
        <p className="mt-1 text-xs leading-relaxed text-danger/80">{error}</p>
      </div>
    );
  }

  const currentIndex = order.indexOf(step);

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-xs">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
        処理状況
      </p>
      <div className="space-y-0">
        {steps.map(({ key, label, desc }, index) => {
          const stepIndex = order.indexOf(key);
          const isActive = step === key;
          const isDone = stepIndex < currentIndex || step === "done";
          const isLast = index === steps.length - 1;

          return (
            <div key={key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                    isDone && !isActive
                      ? "border-accent bg-accent text-white"
                      : isActive && step !== "done"
                        ? "border-accent bg-accent-subtle"
                        : isActive && step === "done"
                          ? "border-accent bg-accent text-white"
                          : "border-border bg-background"
                  )}
                >
                  {isActive && step !== "done" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  ) : isDone ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-border" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "my-1 w-0.5 flex-1 min-h-[24px]",
                      isDone ? "bg-accent/30" : "bg-border"
                    )}
                  />
                )}
              </div>
              <div className={cn("pb-6", isLast && "pb-0")}>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isActive || isDone
                      ? "text-foreground"
                      : "text-foreground-muted"
                  )}
                >
                  {label}
                </p>
                <p className="text-xs text-foreground-muted">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
