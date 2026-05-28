"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mic,
  UserCog,
  Building2,
  Bell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/cas", label: "CA一覧", icon: UserCog },
  { href: "/students", label: "学生一覧", icon: Users },
  { href: "/company-updates", label: "企業連絡", icon: Building2 },
  { href: "/alerts", label: "フォローアラート", icon: Bell },
  { href: "/interviews/upload", label: "面談AI", icon: Mic },
  { href: "/settings", label: "設定", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-border bg-background">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-xs">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground-muted">
              Supira
            </p>
            <h1 className="text-[15px] font-semibold leading-tight tracking-tight text-foreground">
              Career OS
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted/80">
          メニュー
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-150",
                active
                  ? "bg-accent-subtle font-medium text-accent shadow-xs"
                  : "text-foreground-secondary hover:bg-background-subtle hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
              )}
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  active
                    ? "text-accent"
                    : "text-foreground-muted group-hover:text-foreground-secondary"
                )}
                strokeWidth={active ? 2 : 1.75}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-subtle p-3">
        <div className="mb-2 rounded-lg bg-background-subtle px-3 py-2.5">
          <p className="text-[11px] font-medium text-foreground-muted">
            代表モード
          </p>
          <p className="mt-0.5 truncate text-xs font-medium text-foreground-secondary">
            福与さん
          </p>
        </div>
      </div>
    </aside>
  );
}
