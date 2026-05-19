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
      { id: "v1", sku: "SD-01", price: 1500, stock: 10, imageUrl: null, attributes: {}, linePrice: 1500 },
    ],
    minPrice: 1500,
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
      { id: "v2", sku: "GF-01", price: 900, stock: 20, imageUrl: null, attributes: {}, linePrice: 900 },
    ],
    minPrice: 900,
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
    minPrice: p.minPrice,
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
    return { brands: ["SuperDog", "GatoFeliz"], categories: ["Alimentos", "Higiene"], petTypes: ["Perro", "Gato"] } as CatalogFacets;
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
