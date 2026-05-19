"use client";

import Link from "next/link";
import { useState } from "react";
import authService from "@/lib/services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message ?? "No se pudo enviar la solicitud");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-[var(--vp-primary)]">¿Olvidaste tu contraseña?</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Te enviaremos un enlace por email para elegir una contraseña nueva.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-zinc-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            required
            autoComplete="email"
          />
        </label>
        {message && <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--vp-primary)] py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Enviando…" : "Enviar enlace"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        <Link href="/login" className="text-[var(--vp-accent)] hover:underline">
          Volver a ingresar
        </Link>
      </p>
    </section>
  );
}
