import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeSession, getDefaultRedirect, SESSION_COOKIE } from "@/lib/auth/session";
import { isAdminRoute, isCaPortalRoute } from "@/lib/auth/types";

export function middleware(request: NextRequest) {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";
  const skipAuth = process.env.SKIP_AUTH === "true" || dataSource === "mock";
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/login");

  const sessionRaw = request.cookies.get(SESSION_COOKIE)?.value;
  const session = sessionRaw ? decodeSession(sessionRaw) : null;

  if (skipAuth && !sessionRaw) {
    return NextResponse.next();
  }

  if (!session && !isAuthPage && !skipAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(
      new URL(getDefaultRedirect(session.role), request.url)
    );
  }

  if (session?.role === "ca") {
    if (isAdminRoute(pathname) && !isCaPortalRoute(pathname)) {
      return NextResponse.redirect(new URL("/ca-home", request.url));
    }
  }

  if (session?.role === "admin" && pathname === "/ca-home") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 代表は CAポータル（ホーム以外）をプレビュー可能 — /ca-home のみダッシュボードへ

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
