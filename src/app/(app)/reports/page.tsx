import { FileBarChart } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";

export default function ReportsPage() {
  return (
    <>
      <TopBar
        title="レポート"
        description="組織横断の週次レポート（準備中）"
      />
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-md rounded-xl border border-border bg-background px-8 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-background-subtle">
            <FileBarChart className="h-6 w-6 text-foreground-muted" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            週次レポートは準備中です
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
            オペレーションセンターのデータをもとに、CA別・離脱リスク別の週次サマリーを今後提供予定です。
          </p>
        </div>
      </div>
    </>
  );
}
