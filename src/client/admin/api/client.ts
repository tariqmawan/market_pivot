import { apiFetch } from "../../stores/authStore";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: { page: number; limit: number; total: number; pages: number };
  timestamp: string;
}

export class AdminApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AdminApiError";
  }
}

export async function adminGet<T>(path: string, params?: Record<string, string | number>): Promise<ApiResponse<T>> {
  const qs = params
    ? "?" + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    : "";
  const res = await apiFetch(`/admin${path}${qs}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new AdminApiError(json.error ?? "Request failed", res.status);
  }
  return json as ApiResponse<T>;
}

export async function adminPost<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  const res = await apiFetch(`/admin${path}`, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new AdminApiError(json.error ?? "Request failed", res.status);
  return json as ApiResponse<T>;
}

export async function adminPut<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  const res = await apiFetch(`/admin${path}`, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new AdminApiError(json.error ?? "Request failed", res.status);
  return json as ApiResponse<T>;
}

export async function adminDelete<T>(path: string): Promise<ApiResponse<T>> {
  const res = await apiFetch(`/admin${path}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok || !json.success) throw new AdminApiError(json.error ?? "Request failed", res.status);
  return json as ApiResponse<T>;
}
