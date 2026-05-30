import { NextRequest, NextResponse } from "next/server";
import {
  decodeSession,
  encodeSession,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import type { AppSession } from "@/lib/auth/types";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function readSession(request: NextRequest): AppSession | null {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  return decodeSession(raw);
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ session: readSession(request) });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AppSession;
    if (body.role !== "admin" && body.role !== "ca") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    if (!body.userId || !body.name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (body.role === "ca" && !body.caId) {
      return NextResponse.json({ error: "CA id required" }, { status: 400 });
    }

    const session: AppSession = {
      role: body.role,
      userId: body.userId,
      name: body.name,
      caId: body.caId,
    };

    const res = NextResponse.json({ session });
    res.cookies.set(SESSION_COOKIE, encodeSession(session), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
