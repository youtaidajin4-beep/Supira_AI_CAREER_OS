"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { ActivityFeed } from "@/components/operations/ActivityFeed";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { ActivityLog } from "@/lib/data/types";

export default function ActivityFeedPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    void fetchJson<ActivityLog[]>("/api/activity-logs", {
      fallback: () => clientMockFallback.activityLogs(),
    }).then((data) => setLogs(Array.isArray(data) ? data : []));
  }, []);

  return (
    <>
      <TopBar
        title="活動フィード"
        description="現場で起きていることを時系列で確認"
      />
      <div className="mx-auto max-w-3xl p-6 lg:p-8">
        <div className="rounded-xl border border-border bg-background p-6">
          <ActivityFeed logs={logs} />
        </div>
      </div>
    </>
  );
}
