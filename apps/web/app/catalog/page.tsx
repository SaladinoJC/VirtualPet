import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductCard } from "@/components/ProductCard";
import productsService from "@/lib/services/products";
import type { CatalogFacets, ProductPage } from "@/lib/types";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    petType?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = params.page ?? "0";
  const query = new URLSearchParams();
  query.set("page", page);
  query.set("size", "12");
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.petType) query.set("petType", params.petType);
  if (params.brand) query.set("brand", params.brand);
  if (params.minPrice) query.set("minPrice", params.minPrice);
  if (params.maxPrice) query.set("maxPrice", params.maxPrice);
  if (params.sort) query.set("sort", params.sort);

  const [catalog, facets] = await Promise.all([productsService.list(query.toString()), productsService.facets()]);

  function pageHref(nextPage: number) {
    const p = new URLSearchParams();
    Object.entries({ ...params, page: String(nextPage) }).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    return `/catalog?${p.toString()}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
        <div className="mb-6 lg:mb-0">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-zinc-100" />}>
            <CatalogFilters facets={facets} />
          </Suspense>
        </div>

        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Catálogo</h1>
              <p className="mt-1 text-sm text-zinc-500">{catalog.total} productos encontrados</p>
            </div>
            <form method="get" className="flex flex-wrap items-center gap-2">
              {params.q && <input type="hidden" name="q" value={params.q} />}
              {params.category && <input type="hidden" name="category" value={params.category} />}
              {params.petType && <input type="hidden" name="petType" value={params.petType} />}
              {params.brand && <input type="hidden" name="brand" value={params.brand} />}
              {params.minPrice && <input type="hidden" name="minPrice" value={params.minPrice} />}
              {params.maxPrice && <input type="hidden" name="maxPrice" value={params.maxPrice} />}
              <label className="text-sm text-zinc-600">
                Ordenar
                <select name="sort" defaultValue={params.sort ?? "name_asc"} className="ml-2 rounded-lg border px-2 py-1.5 text-sm">
                  <option value="name_asc">Nombre</option>
                  <option value="price_asc">Precio: menor a mayor</option>
                  <option value="price_desc">Precio: mayor a menor</option>
                </select>
              </label>
              <button type="submit" className="rounded-lg bg-[var(--vp-primary)] px-3 py-1.5 text-sm text-white">
                Aplicar
              </button>
            </form>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {catalog.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {catalog.items.length === 0 && (
            <p className="mt-12 text-center text-zinc-500">No hay productos con esos filtros.</p>
          )}

          <div className="mt-10 flex justify-center gap-2">
            {Number(page) > 0 && (
              <Link href={pageHref(Number(page) - 1)} className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-zinc-50">
                ← Anterior
              </Link>
            )}
            <span className="flex items-center px-3 text-sm text-zinc-500">Página {Number(page) + 1}</span>
            {(Number(page) + 1) * catalog.size < catalog.total && (
              <Link href={pageHref(Number(page) + 1)} className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-zinc-50">
                Siguiente →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
