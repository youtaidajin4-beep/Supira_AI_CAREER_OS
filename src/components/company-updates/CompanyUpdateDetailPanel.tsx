"use client";

import {
  Building2,
  Calendar,
  Copy,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react";
import type { CAUser, CompanyUpdate, ShareStatus, Student } from "@/lib/data/types";
import { SHARE_STATUS_LABELS } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "./PriorityBadge";
import { ShareStatusBadge } from "./ShareStatusBadge";
import { cn } from "@/lib/utils/cn";

const STATUS_ORDER: ShareStatus[] = [
  "unshared",
  "shared_ca",
  "shared_student",
  "completed",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface CompanyUpdateDetailPanelProps {
  update: CompanyUpdate;
  cas: CAUser[];
  students: Student[];
  aiLoading: boolean;
  onStatusChange: (status: ShareStatus) => void;
  onAiSuggest: () => void;
  onCopyLine: () => void;
}

export function CompanyUpdateDetailPanel({
  update,
  cas,
  students,
  aiLoading,
  onStatusChange,
  onAiSuggest,
  onCopyLine,
}: CompanyUpdateDetailPanelProps) {
  const relatedCas = update.relatedCaIds
    .map((id) => cas.find((c) => c.id === id))
    .filter(Boolean) as CAUser[];
  const relatedStudents = update.relatedStudentIds
    .map((id) => students.find((s) => s.id === id))
    .filter(Boolean) as Student[];

  const currentIndex = STATUS_ORDER.indexOf(update.shareStatus);

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border bg-background px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-subtle">
            <Building2 className="h-5 w-5 text-accent" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {update.companyName}
            </p>
            <p className="mt-0.5 text-sm text-foreground-secondary">
              {update.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <PriorityBadge priority={update.priority} />
              <ShareStatusBadge status={update.shareStatus} />
            </div>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-foreground-muted">
          <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
          対応期限: {formatDate(update.deadline)}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-area scroll-smooth p-5">
        <section className="mb-6">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            連絡内容
          </h4>
          <Card className="p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground-secondary">
              {update.content || "（内容なし）"}
            </p>
          </Card>
        </section>

        <section className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            共有ステータス
          </h4>
          <div className="space-y-2">
            {STATUS_ORDER.map((status, index) => {
              const active = update.shareStatus === status;
              const done = index < currentIndex;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusChange(status)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    active
                      ? "border-accent bg-accent-subtle/50 font-medium text-accent"
                      : "border-border bg-background hover:bg-background-subtle",
                    done && !active && "opacity-70"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      active
                        ? "bg-accent text-white"
                        : done
                          ? "bg-success-subtle text-success"
                          : "bg-background-subtle text-foreground-muted"
                    )}
                  >
                    {index + 1}
                  </span>
                  {SHARE_STATUS_LABELS[status]}
                </button>
              );
            })}
          </div>
        </section>

        {(relatedCas.length > 0 || relatedStudents.length > 0) && (
          <section className="mb-6">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              関連する担当
            </h4>
            <div className="space-y-3">
              {relatedCas.length > 0 && (
                <Card className="p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-foreground-muted">
                    <UserCog className="h-3.5 w-3.5" />
                    担当CA
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {relatedCas.map((c) => (
                      <span
                        key={c.id}
                        className="rounded-md bg-background-subtle px-2.5 py-1 text-xs font-medium text-foreground-secondary"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
              {relatedStudents.length > 0 && (
                <Card className="p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-foreground-muted">
                    <Users className="h-3.5 w-3.5" />
                    関連学生
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {relatedStudents.map((s) => (
                      <span
                        key={s.id}
                        className="rounded-md bg-background-subtle px-2.5 py-1 text-xs font-medium text-foreground-secondary"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </section>
        )}

        <section>
          <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            <Sparkles className="h-3.5 w-3.5" />
            AI補助
          </h4>
          <Card className="border-accent/20 bg-accent-subtle/30 p-4">
            <p className="text-xs leading-relaxed text-foreground-muted">
              要約文とLINE共有用の短文を自動生成します。CAへの共有前にご確認ください。
            </p>
            <Button
              className="mt-3 w-full"
              size="sm"
              onClick={onAiSuggest}
              disabled={aiLoading}
            >
              <Sparkles className="h-4 w-4" />
              {aiLoading ? "生成中..." : "要約・LINE文を生成"}
            </Button>

            {update.aiSummary && (
              <div className="mt-4 rounded-lg border border-border bg-background p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
                  要約
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground-secondary">
                  {update.aiSummary}
                </p>
              </div>
            )}

            {update.lineShareText && (
              <div className="mt-3 rounded-lg border border-border bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
                    LINE共有用
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={onCopyLine}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    コピー
                  </Button>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground-secondary">
                  {update.lineShareText}
                </p>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
