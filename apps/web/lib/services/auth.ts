import { api } from "@/lib/api";
import type { ApiError } from "@/lib/api";

export type User = { id: string; email: string; role: string; name: string; address: string };
export type AuthResponse = { token: string; user: User };

async function realLogin(email: string, password: string): Promise<AuthResponse> {
  return api<AuthResponse>("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

async function realLogout(token?: string): Promise<void> {
  await api<void>("/api/v1/auth/logout", { method: "POST", token });
}

// Simple mock implementation for local testing without backend
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function mockLogin(email: string, password: string): Promise<AuthResponse> {
  await delay(200);
  return {
    token: "mock-token",
    user: { id: "u_mock", email, role: "user", name: "Demo User", address: "Demo Address" },
  };
}

async function mockLogout(): Promise<void> {
  await delay(50);
}

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === "1";

export const authService = {
  login: (email: string, password: string) => (useMock ? mockLogin(email, password) : realLogin(email, password)),
  logout: (token?: string) => (useMock ? mockLogout() : realLogout(token)),
  register: (payload: { email: string; password: string; name: string; address: string }) =>
    useMock
      ? mockLogin(payload.email, payload.password)
      : api<{ token: string; user: User }>("/api/v1/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  forgotPassword: (email: string) =>
    useMock
      ? Promise.resolve({ message: "Enviado" })
      : api<{ message: string }>("/api/v1/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) =>
    useMock
      ? Promise.resolve({ message: "Contraseña actualizada" })
      : api<{ message: string }>("/api/v1/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),
};

export default authService;
