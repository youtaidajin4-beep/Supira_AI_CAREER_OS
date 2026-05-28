import { CalendarClock, Sparkles } from "lucide-react";
import type { Alert, CompanyUpdate, PriorityStudent } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

interface TodayWorkHeroProps {
  dateLabel: string;
  priorityStudents: PriorityStudent[];
  criticalAlerts: Alert[];
  pendingCompanyUpdates: CompanyUpdate[];
}

export function TodayWorkHero({
  dateLabel,
  priorityStudents,
  criticalAlerts,
  pendingCompanyUpdates,
}: TodayWorkHeroProps) {
  const taskCount =
    criticalAlerts.length +
    priorityStudents.length +
    pendingCompanyUpdates.length;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-accent/20",
        "bg-gradient-to-br from-accent via-accent to-accent-hover",
        "px-6 py-6 text-white shadow-md sm:px-8 sm:py-7"
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-white/80">
            <CalendarClock className="h-4 w-4" strokeWidth={2} />
            <span className="text-sm font-medium">{dateLabel}</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-[1.75rem]">
            今日やるべき業務
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/85">
            離脱リスク・未対応・未共有の企業連絡を優先順に整理しました。上から順に確認してください。
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <HeroStat
            value={taskCount}
            label="対応候補"
            highlight
          />
          <HeroStat
            value={criticalAlerts.length}
            label="緊急"
            warn={criticalAlerts.length > 0}
          />
          <HeroStat
            value={pendingCompanyUpdates.length}
            label="未共有連絡"
          />
        </div>
      </div>
      <div className="relative mt-4 flex items-center gap-1.5 text-xs text-white/75">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
        フォロールールに基づき自動で優先度を算出しています
      </div>
    </section>
  );
}

function HeroStat({
  value,
  label,
  highlight,
  warn,
}: {
  value: number;
  label: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-[4.5rem] rounded-xl px-4 py-3 text-center backdrop-blur-sm",
        highlight ? "bg-white/20 ring-1 ring-white/30" : "bg-white/10",
        warn && value > 0 && "ring-2 ring-warning/80"
      )}
    >
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-white/80">
        {label}
      </p>
    </div>
  );
}
