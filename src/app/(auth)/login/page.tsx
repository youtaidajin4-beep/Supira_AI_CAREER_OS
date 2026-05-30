"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getDefaultRedirect } from "@/lib/auth/session";
import type { AccountRole, AppSession } from "@/lib/auth/types";
import { fetchJson } from "@/lib/api/fetch-json";
import { clientMockFallback } from "@/lib/api/client-mock-fallback";
import type { CAUser } from "@/lib/data/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AccountRole>("admin");
  const [caId, setCaId] = useState("ca-001");
  const [cas, setCas] = useState<CAUser[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFirebase = process.env.NEXT_PUBLIC_DATA_SOURCE === "firebase";

  useEffect(() => {
    void fetchJson<CAUser[]>("/api/cas", {
      fallback: () => clientMockFallback.cas(),
    }).then((list) => {
      if (Array.isArray(list) && list.length > 0) {
        setCas(list);
        setCaId(list[0].id);
      }
    });
  }, []);

  const createSession = async (session: AppSession) => {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    });
    if (!res.ok) throw new Error("セッションの保存に失敗しました");
    router.push(getDefaultRedirect(session.role));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "admin") {
        if (!isFirebase) {
          await createSession({
            role: "admin",
            userId: "admin-001",
            name: "福与 代表",
          });
          return;
        }
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        const { getFirebaseAuth } = await import("@/lib/firebase/client");
        await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
        await createSession({
          role: "admin",
          userId: "admin-001",
          name: "福与 代表",
        });
        return;
      }

      const ca = cas.find((c) => c.id === caId);
      if (!ca) {
        setError("CAを選択してください");
        return;
      }

      if (isFirebase) {
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        const { getFirebaseAuth } = await import("@/lib/firebase/client");
        await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      }

      await createSession({
        role: "ca",
        userId: ca.id,
        name: ca.name,
        caId: ca.id,
      });
    } catch {
      setError("ログインに失敗しました。入力内容を確認してください。");
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
        <p className="mt-1 text-sm text-foreground-muted">ログイン</p>
      </div>

      {!isFirebase && (
        <div className="mb-6 rounded-lg border border-accent/20 bg-accent-subtle/60 px-4 py-3 text-center text-xs leading-relaxed text-accent">
          モックモード：ロールを選んでログインできます
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
              role === "admin"
                ? "border-accent bg-accent-subtle text-accent"
                : "border-border text-foreground-secondary hover:bg-background-subtle"
            }`}
          >
            代表（Admin）
          </button>
          <button
            type="button"
            onClick={() => setRole("ca")}
            className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
              role === "ca"
                ? "border-accent bg-accent-subtle text-accent"
                : "border-border text-foreground-secondary hover:bg-background-subtle"
            }`}
          >
            CA
          </button>
        </div>

        {role === "ca" && (
          <Select
            label="担当CA"
            value={caId}
            onChange={(e) => setCaId(e.target.value)}
          >
            {cas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}（{c.role}）
              </option>
            ))}
          </Select>
        )}

        {isFirebase && (
          <>
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
          </>
        )}

        {error && (
          <p className="rounded-lg bg-danger-subtle px-3 py-2 text-xs text-danger">
            {error}
          </p>
        )}
        <Button type="submit" disabled={loading} size="lg" className="w-full">
          {loading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>
    </Card>
  );
}
