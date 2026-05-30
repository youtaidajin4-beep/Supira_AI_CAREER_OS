"use client";

import Link from "next/link";
import { ArrowRight, Mic, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import type { Student } from "@/lib/data/types";
import { cn } from "@/lib/utils/cn";

type Variant = "admin-on-student" | "ca-on-student";

interface PortalContextBarProps {
  student: Student;
  variant: Variant;
  className?: string;
}

/**
 * 代表画面 ↔ CAポータルの導線
 */
export function PortalContextBar({
  student,
  variant,
  className,
}: PortalContextBarProps) {
  const { session } = useAuth();
  const isAdmin = session?.role === "admin";

  if (variant === "admin-on-student" && isAdmin) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border border-accent/20 bg-accent-subtle/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
          className
        )}
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold text-accent">チーム連携</p>
          <p className="mt-0.5 text-sm text-foreground-secondary">
            担当{" "}
            <Link
              href={`/cas/${student.assignedCaId}`}
              className="font-medium text-foreground hover:text-accent"
            >
              {student.assignedCaName}
            </Link>
            が日々入力する面談データは、CAポータルと共有されています。
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={`/ca/interviews?studentId=${student.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-foreground shadow-xs ring-1 ring-border hover:bg-background-subtle"
          >
            <Mic className="h-3.5 w-3.5 text-accent" />
            面談入力（CA画面）
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href={`/ca/students/${student.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-foreground shadow-xs ring-1 ring-border hover:bg-background-subtle"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-accent" />
            CA視点で見る
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "ca-on-student") {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border border-border bg-background-subtle/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
          className
        )}
      >
        <div className="min-w-0 text-sm text-foreground-secondary">
          <p className="text-xs font-semibold text-foreground-muted">共有データ</p>
          <p className="mt-1">
            面談記録は代表ダッシュボードの学生カルテにも自動反映されます。
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {isAdmin ? (
            <Link
              href={`/students/${student.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-foreground shadow-xs ring-1 ring-border hover:bg-background-subtle"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-accent" />
              代表用カルテ
              <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <Link
              href={`/ca/students/${student.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-foreground shadow-xs ring-1 ring-border hover:bg-background-subtle"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-accent" />
              学生詳細
            </Link>
          )}
          <Link
            href={`/ca/interviews?studentId=${student.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-foreground shadow-xs ring-1 ring-border hover:bg-background-subtle"
          >
            <Mic className="h-3.5 w-3.5 text-accent" />
            面談入力
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
