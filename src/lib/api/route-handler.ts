import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data ?? [], init);
}

export function jsonError(
  message: string,
  status = 500,
  data: unknown = []
) {
  return NextResponse.json({ error: message, data }, { status });
}

export async function withJsonRoute<T>(
  handler: () => Promise<T>,
  errorMessage: string,
  emptyFallback: unknown = []
) {
  try {
    const result = await handler();
    if (result === undefined) {
      return jsonError(errorMessage, 500, emptyFallback);
    }
    return jsonOk(result);
  } catch (error) {
    console.error(errorMessage, error);
    const message =
      error instanceof Error ? error.message : errorMessage;
    return jsonError(message, 500, emptyFallback);
  }
}
