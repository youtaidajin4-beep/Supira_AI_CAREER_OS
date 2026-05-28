export async function safeJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Invalid JSON response:", text.slice(0, 200), error);
    return null;
  }
}

export function safeParseLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to parse localStorage key: ${key}`, error);
    localStorage.removeItem(key);
    return fallback;
  }
}
