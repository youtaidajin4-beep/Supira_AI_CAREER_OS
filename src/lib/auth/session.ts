import type { AppSession } from "./types";

export const SESSION_COOKIE = "supira_session";

export function encodeSession(session: AppSession): string {
  return Buffer.from(JSON.stringify(session), "utf-8").toString("base64url");
}

export function decodeSession(value: string): AppSession | null {
  try {
    const json = Buffer.from(value, "base64url").toString("utf-8");
    const parsed = JSON.parse(json) as AppSession;
    if (parsed.role !== "admin" && parsed.role !== "ca") return null;
    if (!parsed.userId || !parsed.name) return null;
    if (parsed.role === "ca" && !parsed.caId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getDefaultRedirect(role: AppSession["role"]): string {
  return role === "ca" ? "/ca-home" : "/";
}
