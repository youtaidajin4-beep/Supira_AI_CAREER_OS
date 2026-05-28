"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { AlertCard } from "@/components/alerts/AlertCard";
import { AlertsSummaryBar } from "@/components/alerts/AlertsSummaryBar";
import { EmptyState } from "@/components/ui/empty-state";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { Alert, AlertSeverity, CAUser, Student } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

const groupMeta: Record<
  AlertSeverity,
  { label: string; description: string; headerClass: string }
> = {
  critical: {
    label: "Critical — 今すぐ介入",
    description: "離脱リスク・未対応・重要企業連絡など",
    headerClass: "text-danger",
  },
  warning: {
    label: "Attention — 今日中に確認",
    description: "温度感低下・記録未更新・フォロー遅延など",
    headerClass: "text-warning",
  },
  info: {
    label: "Info — 確認のみ",
    description: "面談完了・メモ更新・共有済みなど",
    headerClass: "text-accent",
  },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cas, setCas] = useState<CAUser[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [severity, setSeverity] = useState("");

  useEffect(() => {
    void fetchJson<CAUser[]>("/api/cas", {
      fallback: () => clientMockFallback.cas(),
    }).then(setCas);
    void fetchJson<Student[]>("/api/students", {
      fallback: () => clientMockFallback.students(),
    }).then(setStudents);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (severity) params.set("severity", severity);
    void fetchJson<Alert[]>(`/api/alerts?${params}`, {
      fallback: () => clientMockFallback.alerts(),
    }).then(setAlerts);
  }, [severity]);

  const filtered = useMemo(() => {
    if (!severity) return alerts;
    return alerts.filter((a) => a.severity === severity);
  }, [alerts, severity]);

  const groups = useMemo(() => {
    const order: AlertSeverity[] = ["critical", "warning", "info"];
    return order
      .map((sev) => ({
        severity: sev,
        ...groupMeta[sev],
        items: filtered.filter((a) => a.severity === sev),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  const resolveName = (alert: Alert) => ({
    caName: alert.relatedCaId
      ? cas.find((c) => c.id === alert.relatedCaId)?.name
      : undefined,
    studentName: alert.relatedStudentId
      ? students.find((s) => s.id === alert.relatedStudentId)?.name
      : undefined,
  });

  const hasAlerts = filtered.length > 0;

  return (
    <>
      <TopBar
        title="フォローアラート"
        description={
          hasAlerts
            ? `${filtered.length}件 · 緊急 ${filtered.filter((a) => a.severity === "critical").length}件`
            : "フォロー漏れを一覧で確認"
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto scroll-area scroll-smooth">
        <div className="mx-auto max-w-3xl space-y-6 p-6 lg:p-8">
          <AlertsSummaryBar
            alerts={alerts}
            activeSeverity={severity}
            onSeverityChange={setSeverity}
          />

          {!hasAlerts ? (
            <CardEmpty />
          ) : (
            <div className="space-y-10">
              {groups.map((group) => (
                <section key={group.severity}>
                  <div className="mb-4 flex items-end justify-between gap-4 border-b border-border-subtle pb-3">
                    <div>
                      <h2
                        className={cn(
                          "text-base font-semibold tracking-tight",
                          group.headerClass
                        )}
                      >
                        {group.label}
                      </h2>
                      <p className="mt-0.5 text-xs text-foreground-muted">
                        {group.description}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-background-subtle px-2.5 py-0.5 text-xs font-medium tabular-nums text-foreground-muted">
                      {group.items.length}件
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {group.items.map((alert) => {
                      const names = resolveName(alert);
                      return (
                        <li key={alert.id}>
                          <AlertCard
                            alert={alert}
                            caName={names.caName}
                            studentName={names.studentName}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CardEmpty() {
  return (
    <EmptyState
      icon={CheckCircle2}
      title="対応が必要なアラートはありません"
      description="学生のフォロー状況は良好です。新しいアラートが発生するとここに表示されます。"
      className="rounded-xl border border-border bg-background py-16 shadow-xs"
    />
  );
}
