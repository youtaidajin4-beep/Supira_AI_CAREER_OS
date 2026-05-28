import { CalendarClock } from "lucide-react";
import type { Alert, CompanyUpdate } from "@/lib/data/types";

interface TodayWorkHeroProps {
  dateLabel: string;
  priorityCount: number;
  interventionCount: number;
  criticalAlerts: Alert[];
  pendingCompanyUpdates: CompanyUpdate[];
}

export function TodayWorkHero({
  dateLabel,
  priorityCount,
  interventionCount,
  pendingCompanyUpdates,
}: TodayWorkHeroProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-border/80 bg-background shadow-[var(--shadow-card)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_-20%,var(--accent-subtle),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-accent/[0.06] blur-3xl"
        aria-hidden
      />
      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex items-center gap-2 text-foreground-muted">
          <CalendarClock className="h-4 w-4 text-accent" strokeWidth={1.75} />
          <span className="text-sm font-medium">{dateLabel}</span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
          おはようございます、福与さん
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground-secondary">
          今日は
          <span className="font-medium text-foreground">
            {" "}
            優先学生 {priorityCount}名
          </span>
          ・
          <span className="font-medium text-foreground">
            介入候補 {interventionCount}件
          </span>
          ・
          <span className="font-medium text-foreground">
            未共有連絡 {pendingCompanyUpdates.length}件
          </span>
          。上から順に確認してください。
        </p>
      </div>
    </header>
  );
}
