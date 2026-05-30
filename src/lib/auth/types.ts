import type { AccountRole } from "@/lib/data/types";

export type { AccountRole };

export interface AppSession {
  role: AccountRole;
  userId: string;
  name: string;
  /** CAロール時の ca_users.id */
  caId?: string;
}

export const ADMIN_ONLY_PREFIXES = [
  "/cas",
  "/companies",
  "/company-updates",
  "/alerts",
] as const;

export const CA_PORTAL_PREFIXES = ["/ca-home", "/ca"] as const;

export function isAdminRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/students")) return true;
  if (pathname.startsWith("/interviews")) return true;
  if (pathname === "/settings") return true;
  return ADMIN_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
}

export function isCaPortalRoute(pathname: string): boolean {
  return (
    pathname === "/ca-home" ||
    pathname.startsWith("/ca/") ||
    pathname.startsWith("/analysis/")
  );
}

/** 代表・CAどちらもアクセス可能 */
export function isSharedRoute(pathname: string): boolean {
  return pathname.startsWith("/analysis/");
}
