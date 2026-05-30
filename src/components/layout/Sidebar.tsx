"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { AdminSidebar } from "./AdminSidebar";
import { CASidebar } from "./CASidebar";

export function Sidebar() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-border bg-[#fafbfc]" />
    );
  }

  if (session?.role === "ca") {
    return <CASidebar />;
  }

  return <AdminSidebar />;
}
