"use client";

import { CAPageFrame } from "@/components/ca/CAPageFrame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

export default function CASettingsPage() {
  const { session, signOut } = useAuth();

  return (
    <CAPageFrame title="設定" description="アカウントと通知" showAssistant={false}>
      <div className="p-5 pb-10 lg:p-6 lg:pb-12">
        <Card padding="md" className="max-w-md">
          <p className="text-sm font-medium text-foreground">ログイン情報</p>
          <p className="mt-2 text-sm text-foreground-secondary">
            {session?.name ?? "—"}
          </p>
          <p className="text-xs text-foreground-muted">CA ID: {session?.caId}</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-6"
            onClick={() => void signOut()}
          >
            ログアウト
          </Button>
        </Card>
      </div>
    </CAPageFrame>
  );
}
