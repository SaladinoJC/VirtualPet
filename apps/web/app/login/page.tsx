"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import authService from "@/lib/services/auth";
import { saveAuth } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("cliente@demo.local");
  const [password, setPassword] = useState("cliente123");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await authService.login(email, password);
      saveAuth(res.token, res.user);
      router.push(params.get("redirect") ?? "/");
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err.message ?? "Error");
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Ingresar</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-[var(--vp-primary)] py-2 font-medium text-white hover:bg-[var(--vp-primary-dark)]">
          Entrar
        </button>
      </form>
      <p className="mt-3 text-sm">
        <Link href="/forgot-password" className="text-[var(--vp-accent)] hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
      <p className="mt-4 text-sm">
        ¿No tenés cuenta? <Link href="/register">Registrate</Link>
      </p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
