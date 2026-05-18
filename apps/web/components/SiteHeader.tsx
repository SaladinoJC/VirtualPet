"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { clearAuth, getUser, type User } from "@/lib/auth";

export function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUser(getUser());
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--vp-border)] bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[var(--vp-primary-dark)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--vp-primary)] text-lg text-white">
              🐾
            </span>
            Virtual Pet
          </Link>

          <form onSubmit={onSearch} className="order-3 w-full flex-1 md:order-none md:max-w-md lg:max-w-xl">
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full rounded-full border border-[var(--vp-border)] bg-[var(--background)] py-2.5 pr-4 pl-10 text-sm outline-none focus:border-[var(--vp-primary)] focus:ring-2 focus:ring-green-100"
              />
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">⌕</span>
            </div>
          </form>

          <nav className="ml-auto flex items-center gap-3 text-sm font-medium text-zinc-700">
            <Link href="/catalog" className="hidden sm:inline hover:text-[var(--vp-primary)]">
              Catálogo
            </Link>
            <Link href="/about" className="hidden sm:inline hover:text-[var(--vp-primary)]">
              Nosotros
            </Link>
            {user ? (
              <>
                <Link href="/account/orders" className="hover:text-[var(--vp-primary)]">
                  Pedidos
                </Link>
                <span className="hidden max-w-[8rem] truncate text-zinc-500 md:inline">{user.name}</span>
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => {
                    clearAuth();
                    setUser(null);
                  }}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-[var(--vp-primary)]">
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[var(--vp-primary)] px-4 py-2 text-white hover:bg-[var(--vp-primary-dark)]"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>

        <nav className="mt-3 hidden gap-4 overflow-x-auto border-t border-[var(--vp-border)] pt-3 text-xs font-medium text-zinc-600 md:flex">
          <Link href="/catalog?petType=perro" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Perros
          </Link>
          <Link href="/catalog?petType=gato" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Gatos
          </Link>
          <Link href="/catalog?category=alimentos" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Alimentos
          </Link>
          <Link href="/catalog?category=juguetes" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Juguetes
          </Link>
          <Link href="/catalog?category=higiene" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Higiene
          </Link>
          <Link href="/catalog?category=camas" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Camas
          </Link>
        </nav>
      </div>
    </header>
  );
}
