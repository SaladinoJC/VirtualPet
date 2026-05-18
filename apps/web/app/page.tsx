import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import productsService from "@/lib/services/products";
import type { ProductPage } from "@/lib/types";

export default async function HomePage() {
  const catalog = await productsService.list("page=0&size=8&sort=price_asc");

  return (
    <>
      <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 px-4 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-100">Mar del Plata</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              El cuidado perfecto para tu mascota
            </h1>
            <p className="mt-4 max-w-lg text-lg text-green-50">
              Alimentos, camas, juguetes e higiene. Envío en Mar del Plata y zona.
            </p>
            <Link
              href="/catalog"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-green-700 shadow-lg hover:bg-green-50"
            >
              Ver catálogo
            </Link>
          </div>
          <div className="hidden rounded-3xl bg-white/15 p-8 backdrop-blur md:block">
            <p className="text-6xl">🐕 🐈</p>
            <p className="mt-4 text-green-50">Más de {catalog.total} productos para perros y gatos</p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--vp-border)] bg-white py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8 px-4 text-center text-sm text-zinc-600">
          <span>🚚 Envío rápido</span>
          <span>↩️ Devoluciones fáciles</span>
          <span>🔒 Pagos seguros</span>
          <span>⭐ Atención local</span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-zinc-900">Productos populares</h2>
          <Link href="/catalog" className="text-sm font-medium text-[var(--vp-primary)] hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
