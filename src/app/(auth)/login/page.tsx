"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFirebase = process.env.NEXT_PUBLIC_DATA_SOURCE === "firebase";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isFirebase) {
      router.push("/");
      return;
    }

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { getFirebaseAuth } = await import("@/lib/firebase/client");
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      router.push("/");
    } catch {
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card padding="lg" className="w-full max-w-[400px] shadow-md">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent shadow-xs">
          <span className="text-lg font-bold text-white">S</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Career OS
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">CAログイン</p>
      </div>

      {!isFirebase && (
        <div className="mb-6 rounded-lg border border-accent/20 bg-accent-subtle/60 px-4 py-3 text-center text-xs leading-relaxed text-accent">
          モックモードでは任意のメールでログインできます
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && (
          <p className="rounded-lg bg-danger-subtle px-3 py-2 text-xs text-danger">
            {error}
          </p>
        )}
        <Button type="submit" disabled={loading} size="lg" className="w-full">
          {loading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs font-medium text-accent hover:text-accent-hover"
        >
          ダッシュボードへ（モック）
        </Link>
      </p>
    </Card>
  );
}
