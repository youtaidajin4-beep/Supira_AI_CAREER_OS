import Link from "next/link";
import { AlertCircle, Info, ChevronRight } from "lucide-react";
import type { Notification } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

interface NotificationListProps {
  notifications: Notification[];
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader
        title="アラート・通知"
        description={`${notifications.filter((n) => !n.read).length}件の未読`}
      />
      <ul className="max-h-[420px] divide-y divide-border-subtle overflow-y-auto scroll-area">
        {notifications.length === 0 ? (
          <EmptyState
            title="通知はありません"
            description="学生のフォロー状況は良好です"
          />
        ) : (
          notifications.map((notif) => (
            <li key={notif.id}>
              <div
                className={cn(
                  "flex gap-3 px-5 py-4 transition-colors hover:bg-background-subtle/80",
                  !notif.read && "bg-accent-subtle/40"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    notif.type === "alert"
                      ? "bg-danger-subtle"
                      : "bg-accent-subtle"
                  )}
                >
                  {notif.type === "alert" ? (
                    <AlertCircle
                      className="h-4 w-4 text-danger"
                      strokeWidth={1.75}
                    />
                  ) : (
                    <Info
                      className="h-4 w-4 text-accent"
                      strokeWidth={1.75}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
                    {notif.message}
                  </p>
                  {notif.studentId && (
                    <Link
                      href={`/students/${notif.studentId}`}
                      className="mt-2 inline-flex items-center gap-0.5 text-xs font-medium text-accent hover:text-accent-hover"
                    >
                      カルテを開く
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}
