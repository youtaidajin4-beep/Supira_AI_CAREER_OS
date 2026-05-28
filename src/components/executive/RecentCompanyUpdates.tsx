import Link from "next/link";
import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CompanyUpdate } from "@/lib/data/types";
import { SHARE_STATUS_LABELS } from "@/lib/data/types";

export function RecentCompanyUpdates({
  updates,
}: {
  updates: CompanyUpdate[];
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-foreground-muted" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold text-foreground">未共有の企業連絡</h3>
        </div>
        <Link href="/company-updates" className="text-xs text-accent hover:underline">
          すべて見る
        </Link>
      </div>
      {updates.length === 0 ? (
        <p className="text-sm text-foreground-muted">未共有の連絡はありません</p>
      ) : (
        <ul className="space-y-3">
          {updates.slice(0, 5).map((u) => (
            <li
              key={u.id}
              className="rounded-lg border border-border bg-background-subtle/50 px-3 py-2.5"
            >
              <p className="text-sm font-medium text-foreground">
                {u.companyName} — {u.title}
              </p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                {SHARE_STATUS_LABELS[u.shareStatus]}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
