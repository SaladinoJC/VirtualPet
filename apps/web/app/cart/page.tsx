"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/api";
import cartService from "@/lib/services/cart";
import { getToken } from "@/lib/auth";
import { getCartSession } from "@/lib/cart-session";
import type { Cart } from "@/lib/types";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await cartService.getCart(getToken() ?? undefined, getCartSession());
      setCart(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(variantId: string) {
    await cartService.removeItem(variantId, getToken() ?? undefined, getCartSession());
    load();
  }

  if (loading) return <p className="p-10 text-center">Cargando carrito...</p>;
  if (!cart || cart.items.length === 0) {
    return (
      <>
        <section className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
          <Link href="/catalog" className="mt-4 inline-block text-emerald-600">
            Ir al catálogo
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">Carrito</h1>
        <ul className="mt-8 space-y-4">
          {cart.items.map((item) => (
            <li key={item.variantId} className="flex gap-4 rounded-xl border bg-white p-4">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="h-20 w-20 rounded-lg object-cover" />
              )}
              <section className="flex-1">
                <p className="font-semibold">{item.productName}</p>
                <p className="text-sm text-zinc-500">{item.sku}</p>
                <p className="text-sm">Cantidad: {item.quantity}</p>
              </section>
              <section className="text-right">
                <p className="font-bold">{formatPrice(item.lineTotal)}</p>
                <button
                  type="button"
                  onClick={() => remove(item.variantId)}
                  className="mt-2 text-sm text-red-600"
                >
                  Quitar
                </button>
              </section>
            </li>
          ))}
        </ul>
        <section className="mt-8 flex items-center justify-between rounded-xl bg-emerald-50 p-6">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-emerald-700">{formatPrice(cart.subtotal)}</span>
        </section>
        <Link
          href="/checkout"
          className="mt-6 block rounded-full bg-emerald-600 py-3 text-center font-semibold text-white hover:bg-emerald-700"
        >
          Ir al checkout
        </Link>
      </section>
    </>
  );
}
