import { api } from "@/lib/api";
import type { ProductPage, CatalogFacets, ProductDetail, ProductSummary } from "@/lib/types";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === "1";

const MOCK_PRODUCTS: ProductDetail[] = [
  {
    id: "prod-1",
    slug: "croquetas-superdog",
    name: "Croquetas SuperDog",
    description: "Croquetas nutritivas para perros adultos.",
    brand: "SuperDog",
    category: "Alimentos",
    petType: "Perro",
    variants: [
      { id: "v1", sku: "SD-01", price: 1500, stock: 10, imageUrl: null, attributes: {} },
    ],
    basePrice: 1500,
    categorySlug: "alimentos",
  },
  {
    id: "prod-2",
    slug: "arena-gatuna-soft",
    name: "Arena Gatuna Soft",
    description: "Arena aglomerante para gatos.",
    brand: "GatoFeliz",
    category: "Higiene",
    petType: "Gato",
    variants: [
      { id: "v2", sku: "GF-01", price: 900, stock: 20, imageUrl: null, attributes: {} },
    ],
    basePrice: 900,
    categorySlug: "higiene",
  },
];

function toProductSummary(p: ProductDetail): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    petType: p.petType,
    imageUrl: p.variants[0]?.imageUrl ?? null,
    description: p.description,
    basePrice: p.basePrice,
    minPrice: p.basePrice,
    categorySlug: p.categorySlug,
    category: p.category,
  } as ProductSummary;
}

async function list(query = ""): Promise<ProductPage> {
  if (useMock) {
    const items = MOCK_PRODUCTS.map(toProductSummary);
    return { items, page: 0, size: items.length, total: items.length } as ProductPage;
  }
  return api<ProductPage>(`/api/v1/products${query ? `?${query}` : ""}`);
}

async function facets(): Promise<CatalogFacets> {
  if (useMock) {
    return {
      brands: [
        { value: "superdog", label: "SuperDog", count: 1 },
        { value: "gatofeliz", label: "GatoFeliz", count: 1 }
      ],
      categories: [
        { id: "c1", name: "Alimentos", slug: "alimentos", productCount: 1 },
        { id: "c2", name: "Higiene", slug: "higiene", productCount: 1 }
      ],
      petTypes: [
        { value: "perro", label: "Perro", count: 1 },
        { value: "gato", label: "Gato", count: 1 }
      ]
    } as unknown as CatalogFacets;
  }
  return api<CatalogFacets>("/api/v1/products/facets");
}

async function getById(id: string): Promise<ProductDetail> {
  if (useMock) {
    const p = MOCK_PRODUCTS.find((x) => x.id === id) ?? MOCK_PRODUCTS[0];
    return p;
  }
  return api<ProductDetail>(`/api/v1/products/${id}`);
}

async function getBySlug(slug: string): Promise<ProductDetail> {
  if (useMock) {
    const p = MOCK_PRODUCTS.find((x) => x.slug === slug) ?? MOCK_PRODUCTS[0];
    return p;
  }
  return api<ProductDetail>(`/api/v1/products/by-slug/${slug}`);
}

export const productsService = {
  list: (query = "") => list(query),
  facets: () => facets(),
  getById: (id: string) => getById(id),
  getBySlug: (slug: string) => getBySlug(slug),
};

export default productsService;
