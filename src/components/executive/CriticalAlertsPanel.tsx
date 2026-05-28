import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Alert } from "@/lib/data/types";
import { SeverityBanner } from "@/components/shared/SeverityBanner";

export function CriticalAlertsPanel({ alerts }: { alerts: Alert[] }) {
  const top = alerts.slice(0, 5);
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-danger" strokeWidth={1.75} />
        <h3 className="text-sm font-semibold text-foreground">重要アラート</h3>
      </div>
      {top.length === 0 ? (
        <p className="text-sm text-foreground-muted">現在、重大アラートはありません</p>
      ) : (
        <div className="space-y-2">
          {top.map((alert) => (
            <div key={alert.id}>
              <SeverityBanner
                severity={alert.severity}
                title={alert.title}
                description={alert.description}
              />
              {alert.relatedStudentId && (
                <Link
                  href={`/students/${alert.relatedStudentId}`}
                  className="mt-1 inline-block text-xs text-accent hover:underline"
                >
                  学生詳細を見る →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
