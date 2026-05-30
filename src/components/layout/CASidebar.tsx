"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Mic,
  ListChecks,
  BookOpen,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/auth/auth-context";

const navItems = [
  { href: "/ca-home", label: "ホーム", icon: Home, exact: true },
  { href: "/ca/students", label: "担当学生", icon: Users },
  { href: "/ca/interviews", label: "面談AI", icon: Mic },
  { href: "/ca/actions", label: "次回アクション", icon: ListChecks },
  { href: "/ca/knowledge", label: "ナレッジ", icon: BookOpen },
  { href: "/ca/settings", label: "設定", icon: Settings },
];

export function CASidebar() {
  const pathname = usePathname();
  const { session } = useAuth();

  return (
    <aside className="flex w-[200px] shrink-0 flex-col border-r border-border bg-[#fafbfc]">
      <div className="border-b border-border-subtle px-4 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground-muted">
          CA Portal
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">学生支援</p>
        <p className="mt-1.5 text-[10px] leading-relaxed text-foreground-muted">
          入力データは代表画面と自動連携
        </p>
      </div>

      <nav className="ca-scroll-pane min-h-0 space-y-0.5 px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] transition-colors",
                    active
                      ? "bg-white font-medium text-foreground shadow-sm ring-1 ring-border/80"
                      : "text-foreground-secondary hover:bg-white/60 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-accent" : "text-foreground-muted"
                    )}
                    strokeWidth={active ? 2 : 1.75}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border-subtle p-3">
        <div className="rounded-lg border border-border/60 bg-white px-3 py-2.5 shadow-xs">
          <p className="text-[10px] font-medium text-foreground-muted">ログイン中</p>
          <p className="mt-0.5 text-xs font-semibold text-foreground">
            {session?.name ?? "CA"}
          </p>
        </div>
      </div>
    </aside>
  );
}
