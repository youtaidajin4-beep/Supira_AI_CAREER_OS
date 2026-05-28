"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Check, Copy } from "lucide-react";
import type { CompanyUpdate } from "@/lib/data/types";
import { PriorityBadge } from "@/components/company-updates/PriorityBadge";
import { ShareStatusBadge } from "@/components/company-updates/ShareStatusBadge";
import { cn } from "@/lib/utils/cn";

export function CompanyActionCard({ update }: { update: CompanyUpdate }) {
  const [copied, setCopied] = useState(false);
  const lineText =
    update.lineShareText ||
    `【${update.companyName}】${update.title}\n${update.aiSummary || update.content}`;

  const copyLine = async () => {
    await navigator.clipboard.writeText(lineText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className={cn(
        "flex min-w-[280px] max-w-sm shrink-0 flex-col rounded-xl border border-border bg-background p-4",
        update.shareStatus === "unshared" && "border-l-[3px] border-l-warning"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-subtle">
            <Building2 className="h-4 w-4 text-foreground-muted" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{update.companyName}</p>
            <p className="text-xs text-foreground-muted">{update.title}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <PriorityBadge priority={update.priority} />
          <ShareStatusBadge status={update.shareStatus} />
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-foreground-secondary">
        {update.aiSummary || update.content}
      </p>
      {(update.relatedCaIds.length > 0 ||
        update.relatedStudentIds.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {update.relatedCaIds.length > 0 && (
            <span className="rounded-md bg-background-subtle px-2 py-0.5 text-[10px] text-foreground-muted">
              関連CA {update.relatedCaIds.length}名
            </span>
          )}
          {update.relatedStudentIds.length > 0 && (
            <span className="rounded-md bg-background-subtle px-2 py-0.5 text-[10px] text-foreground-muted">
              関連学生 {update.relatedStudentIds.length}名
            </span>
          )}
        </div>
      )}
      <div className="mt-auto flex gap-2 pt-3">
        <button
          type="button"
          onClick={() => void copyLine()}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground-secondary hover:bg-background-subtle"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              コピー済み
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              LINE文をコピー
            </>
          )}
        </button>
        <Link
          href="/company-updates"
          className="rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-hover"
        >
          詳細
        </Link>
      </div>
    </article>
  );
}
