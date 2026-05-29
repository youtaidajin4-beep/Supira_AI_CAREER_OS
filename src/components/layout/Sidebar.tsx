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
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navGroups = [
  {
    label: "司令塔",
    items: [{ href: "/", label: "ダッシュボード", icon: LayoutDashboard }],
  },
  {
    label: "チーム",
    items: [
      { href: "/cas", label: "CA管理", icon: UserCog },
      { href: "/students", label: "学生管理", icon: Users },
    ],
  },
  {
    label: "企業",
    items: [
      { href: "/companies", label: "企業管理", icon: Building },
      { href: "/company-updates", label: "企業連絡", icon: Building2 },
    ],
  },
  {
    label: "その他",
    items: [
      { href: "/alerts", label: "要注意アラート", icon: Bell },
      { href: "/interviews/upload", label: "面談AI", icon: Mic },
      { href: "/settings", label: "設定", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-border bg-[#fafbfc]">
      <div className="border-b border-border-subtle px-4 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground-muted">
          Supira Career OS
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">代表オペレーション</p>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 scroll-area">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted/90">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
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
          </div>
        ))}
      </nav>

      <div className="border-t border-border-subtle p-3">
        <div className="rounded-lg border border-border/60 bg-white px-3 py-2.5 shadow-xs">
          <p className="text-[10px] font-medium text-foreground-muted">ログイン中</p>
          <p className="mt-0.5 text-xs font-semibold text-foreground">福与 代表</p>
        </div>
      </div>
    </aside>
  );
}
