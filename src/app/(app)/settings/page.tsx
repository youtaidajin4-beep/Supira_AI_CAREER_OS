import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <TopBar title="設定" description="プレースホルダ" />
      <div className="p-6">
        <Card className="p-6">
          <p className="text-sm text-foreground-muted">
            権限・通知・連携設定は今後のフェーズで実装予定です。
          </p>
        </Card>
      </div>
    </>
  );
}
