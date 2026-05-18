"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import authService from "@/lib/services/auth";
import { saveAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    address: "Mar del Plata, Buenos Aires",
  });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await authService.register(form);
      saveAuth(res.token, res.user);
      router.push("/");
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err.message ?? "Error");
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {(["name", "email", "password", "address"] as const).map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
            placeholder={field}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        ))}
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-emerald-600 py-2 text-white">
          Registrarse
        </button>
      </form>
      <p className="mt-4 text-sm">
        ¿Ya tenés cuenta? <Link href="/login">Ingresá</Link>
      </p>
    </section>
  );
}
