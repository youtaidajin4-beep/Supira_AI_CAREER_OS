import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";
  const skipAuth = process.env.SKIP_AUTH === "true" || dataSource === "mock";

  if (skipAuth) return NextResponse.next();

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const session = request.cookies.get("session");

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
