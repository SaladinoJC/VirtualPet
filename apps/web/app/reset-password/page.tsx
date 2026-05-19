"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import authService from "@/lib/services/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!token) {
      setError("Falta el enlace de recuperación. Solicitá uno nuevo.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await authService.resetPassword(token, password);
      setMessage(res.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message ?? "No se pudo restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-[var(--vp-primary)]">Enlace inválido</h1>
        <p className="mt-2 text-sm text-zinc-600">El enlace está incompleto o expiró.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-[var(--vp-accent)] hover:underline">
          Solicitar un enlace nuevo
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-[var(--vp-primary)]">Nueva contraseña</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-zinc-700">
          Contraseña nueva (mín. 6 caracteres)
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            minLength={6}
            required
            autoComplete="new-password"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Repetir contraseña
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            minLength={6}
            required
            autoComplete="new-password"
          />
        </label>
        {message && <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--vp-primary)] py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Guardando…" : "Guardar contraseña"}
        </button>
      </form>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
