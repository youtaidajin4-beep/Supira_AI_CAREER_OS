import { safeJson } from "@/lib/utils/safe-json";

export type FetchJsonOptions<T> = RequestInit & {
  fallback: T | (() => T | Promise<T>);
  /** true のとき JSON の `null` を有効なレスポンスとして扱う */
  allowNull?: boolean;
};

async function resolveFallback<T>(
  fallback: T | (() => T | Promise<T>)
): Promise<T> {
  return typeof fallback === "function"
    ? await (fallback as () => T | Promise<T>)()
    : fallback;
}

/**
 * fetch + safeJson。失敗・空レスポンス・パース失敗時は fallback を返す。
 */
export async function fetchJson<T>(
  input: RequestInfo | URL,
  options: FetchJsonOptions<T>
): Promise<T> {
  const { fallback, allowNull, ...init } = options;

  try {
    const res = await fetch(input, init);
    const data = await safeJson<T>(res);

    if (!res.ok) {
      return resolveFallback(fallback);
    }

    if (data === null && !allowNull) {
      return resolveFallback(fallback);
    }

    return data as T;
  } catch (error) {
    console.error("fetchJson failed:", input, error);
    return resolveFallback(fallback);
  }
}

/**
 * PATCH/POST 等: 成功時のみパース結果を返し、失敗時は null
 */
export async function fetchJsonMutation<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(input, init);
    const data = await safeJson<T>(res);
    if (!res.ok || data === null) return null;
    return data;
  } catch (error) {
    console.error("fetchJsonMutation failed:", input, error);
    return null;
  }
}
