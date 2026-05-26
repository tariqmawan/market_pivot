const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_RETRIES = 1;

export type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string | null;
  message?: string;
  pagination?: unknown;
};

function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE;
  if (typeof base === "string" && base.length > 0) return base.replace(/\/$/, "");
  return "/api";
}

export const API_BASE = getApiBase();

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchJsonOptions = {
  timeoutMs?: number;
  retries?: number;
  signal?: AbortSignal;
};

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
  opts?: FetchJsonOptions
): Promise<ApiResult<T>> {
  const timeoutMs = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retries = opts?.retries ?? DEFAULT_RETRIES;
  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, { credentials: "include", ...init }, timeoutMs);
      const json = (await res.json().catch(() => ({}))) as ApiResult<T>;
      if (!res.ok || json.success === false) {
        const msg =
          json.message ??
          (typeof json.error === "string" ? json.error : null) ??
          `Request failed (${res.status})`;
        throw new ApiError(msg, res.status, json);
      }
      return json;
    } catch (err) {
      lastError = err;
      if (attempt >= retries) break;
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

/** Dispatch a global toast event for API failures (optional UI listener). */
export function emitApiError(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mp:api-error", { detail: { message } }));
  }
}
