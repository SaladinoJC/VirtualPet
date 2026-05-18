export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  categorySlug: string;
  petType: string;
  brand: string;
  imageUrl: string | null;
  minPrice: number;
};

export type ProductPage = {
  items: ProductSummary[];
  total: number;
  page: number;
  size: number;
};

export type Variant = {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  imageUrl: string | null;
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  categorySlug: string;
  petType: string;
  brand: string;
  variants: Variant[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

export type FacetOption = {
  value: string;
  label: string;
  count: number;
};

export type CatalogFacets = {
  petTypes: FacetOption[];
  categories: Category[];
  brands: FacetOption[];
};

export type CartItem = {
  variantId: string;
  productName: string;
  sku: string;
  attributes: Record<string, string>;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string | null;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
};

export type Order = {
  id: string;
  status: string;
  total: number;
  shippingCost: number;
  createdAt: string;
  items: { variantId: string; productName: string; sku: string; quantity: number; unitPrice: number }[];
};
