"use client";

const TOKEN_KEY = "vp_token";
const USER_KEY = "vp_user";

export type User = {
  id: string;
  email: string;
  role: string;
  name: string;
  address: string;
};

export function saveAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}
