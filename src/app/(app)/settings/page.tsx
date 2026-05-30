"use client";

import { LogOut } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

export default function SettingsPage() {
  const { session, signOut } = useAuth();

  return (
    <>
      <TopBar title="設定" description="アカウントとシステム設定" />
      <div className="p-6 lg:p-8">
        <Card padding="md" className="max-w-md">
          <p className="text-sm font-medium text-foreground">ログイン情報</p>
          <p className="mt-2 text-sm text-foreground-secondary">
            {session?.name ?? "福与 代表"}
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            ロール: 代表（admin）
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-6"
            onClick={() => void signOut()}
          >
            <LogOut className="h-4 w-4" />
            ログアウト
          </Button>
        </Card>
        <p className="mt-6 max-w-md text-xs text-foreground-muted">
          サイドバー左下からもログアウトできます。
        </p>
      </div>
    </>
  );
}
