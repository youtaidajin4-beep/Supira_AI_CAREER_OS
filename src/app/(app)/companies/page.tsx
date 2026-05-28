"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import { fetchJson } from "@/lib/api/fetch-json";
import type { CompanyListItem } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);

  useEffect(() => {
    void fetchJson<CompanyListItem[]>("/api/companies", {
      fallback: () => clientMockFallback.companies(),
    }).then((data) => setCompanies(Array.isArray(data) ? data : []));
  }, []);

  return (
    <>
      <TopBar title="企業管理" description={`${companies.length}社`} />
      <div className="min-h-0 flex-1 overflow-y-auto scroll-area p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`}>
              <Card
                className={cn(
                  "p-5 transition-shadow hover:shadow-md",
                  company.urgentContactCount > 0 &&
                    "border-l-[3px] border-l-warning"
                )}
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-subtle">
                    <Building2 className="h-5 w-5 text-foreground-muted" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">
                      {company.name}
                    </h3>
                    <p className="text-xs text-foreground-muted">
                      {company.industry}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-1 text-xs text-foreground-secondary">
                  <span>選考中学生</span>
                  <span className="text-right font-medium tabular-nums">
                    {company.selectingStudentCount}名
                  </span>
                  <span>重要連絡</span>
                  <span className="text-right font-medium tabular-nums">
                    {company.urgentContactCount}
                  </span>
                  <span>関連CA</span>
                  <span className="truncate text-right">
                    {company.relatedCaNames.join("、") || "—"}
                  </span>
                  <span>最終更新</span>
                  <span className="text-right text-foreground-muted">
                    {new Date(company.lastUpdatedAt).toLocaleDateString("ja-JP")}
                  </span>
                </div>
                <p className="mt-2 line-clamp-1 text-xs text-foreground-muted">
                  {company.targetProfile}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
