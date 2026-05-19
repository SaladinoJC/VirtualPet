import { api } from "@/lib/api";
import type { Cart, CartItem } from "@/lib/types";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === "1";
const STORAGE_KEY = "vp_mock_cart";

function defaultCart(): Cart {
  return { items: [], subtotal: 0, itemCount: 0 } as Cart;
}

function isClient() {
  return typeof window !== "undefined";
}

function readCart(): Cart {
  if (!isClient()) return defaultCart();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Cart) : defaultCart();
  } catch {
    return defaultCart();
  }
}

function writeCart(cart: Cart) {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export async function getCart(token?: string, cartSession?: string): Promise<Cart> {
  if (useMock) return Promise.resolve(readCart());
  return api<Cart>("/api/v1/cart", { token, cartSession });
}

export async function addItem(variantId: string, quantity = 1, token?: string, cartSession?: string): Promise<Cart> {
  if (useMock) {
    const cart = readCart();
    const existing = cart.items.find((i) => i.variantId === variantId);
    if (existing) existing.quantity += quantity;
    else
      cart.items.push({ variantId, productName: "Producto mock", sku: variantId, quantity, unitPrice: 1000, lineTotal: 1000 * quantity, imageUrl: null } as CartItem);
    cart.subtotal = cart.items.reduce((s, it) => s + it.lineTotal, 0);
    writeCart(cart);
    return Promise.resolve(cart);
  }
  return api<Cart>("/api/v1/cart/items", {
    method: "PUT",
    body: JSON.stringify({ variantId, quantity }),
    token,
    cartSession,
  });
}

export async function removeItem(variantId: string, token?: string, cartSession?: string): Promise<Cart> {
  if (useMock) {
    const cart = readCart();
    cart.items = cart.items.filter((i) => i.variantId !== variantId);
    cart.subtotal = cart.items.reduce((s, it) => s + it.lineTotal, 0);
    writeCart(cart);
    return Promise.resolve(cart);
  }
  return api<Cart>(`/api/v1/cart/items/${variantId}`, { method: "DELETE", token, cartSession });
}

export const cartService = { getCart, addItem, removeItem };

export default cartService;
