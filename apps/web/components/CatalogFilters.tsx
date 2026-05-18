"use client";

import type { CatalogFacets } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  facets: CatalogFacets;
};

export function CatalogFilters({ facets }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const q = params.get("q") ?? "";
  const petType = params.get("petType") ?? "";
  const category = params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const minPrice = params.get("minPrice") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";
  const sort = params.get("sort") ?? "";

  function apply(updates: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    router.push(`/catalog?${next.toString()}`);
  }

  function toggle(param: string, value: string) {
    apply({ [param]: params.get(param) === value ? null : value });
  }

  return (
    <aside className="space-y-6 rounded-2xl border border-[var(--vp-border)] bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">Precio</h2>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            min={0}
            placeholder="Mín"
            defaultValue={minPrice}
            className="w-full rounded-lg border px-2 py-1.5 text-sm"
            onBlur={(e) => apply({ minPrice: e.target.value || null })}
          />
          <input
            type="number"
            min={0}
            placeholder="Máx"
            defaultValue={maxPrice}
            className="w-full rounded-lg border px-2 py-1.5 text-sm"
            onBlur={(e) => apply({ maxPrice: e.target.value || null })}
          />
        </div>
      </div>

      <FilterGroup title="Mascota">
        {facets.petTypes.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={petType === opt.value}
              onChange={() => toggle("petType", opt.value)}
              className="rounded border-zinc-300 text-[var(--vp-primary)]"
            />
            <span className="flex-1">{opt.label}</span>
            <span className="text-xs text-zinc-400">({opt.count})</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Categoría">
        {facets.categories.map((cat) => (
          <label key={cat.slug} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={category === cat.slug}
              onChange={() => toggle("category", cat.slug)}
              className="rounded border-zinc-300 text-[var(--vp-primary)]"
            />
            <span className="flex-1">{cat.name}</span>
            <span className="text-xs text-zinc-400">({cat.productCount})</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Marca">
        {facets.brands.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={brand === opt.value}
              onChange={() => toggle("brand", opt.value)}
              className="rounded border-zinc-300 text-[var(--vp-primary)]"
            />
            <span className="flex-1">{opt.label}</span>
            <span className="text-xs text-zinc-400">({opt.count})</span>
          </label>
        ))}
      </FilterGroup>

      {(q || petType || category || brand || minPrice || maxPrice || sort) && (
        <button
          type="button"
          onClick={() => router.push("/catalog")}
          className="w-full rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
        >
          Limpiar filtros
        </button>
      )}
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}
