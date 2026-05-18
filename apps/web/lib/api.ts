const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type ApiError = { message: string; status: number };

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string; cartSession?: string } = {}
): Promise<T> {
  const { token, cartSession, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (cartSession) headers.set("X-Cart-Session", cartSession);

  const res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers, cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw { message: body.message ?? res.statusText, status: res.status } as ApiError;
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
}
