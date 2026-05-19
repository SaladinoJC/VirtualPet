"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import checkoutService from "@/lib/services/checkout";
import { getToken } from "@/lib/auth";
import { getCartSession } from "@/lib/cart-session";

type CheckoutResponse = {
  checkoutSessionId: string;
  paymentUrl: string;
  status: string;
  orderId: string | null;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function pay() {
    const token = getToken();
    if (!token) {
      router.push("/login?redirect=/checkout");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await checkoutService.createCheckout(token, getCartSession(), crypto.randomUUID());
      if (res.paymentUrl.includes("/checkout/mock")) {
        router.push(res.paymentUrl.replace("http://localhost:3000", ""));
      } else {
        window.location.href = res.paymentUrl;
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err.message ?? "Error en checkout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-2 text-zinc-600">Envío gratis en Mar del Plata. Delivery propio.</p>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <button
        type="button"
        onClick={pay}
        disabled={loading}
        className="mt-8 w-full rounded-full bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Confirmar y pagar"}
      </button>
    </section>
  );
}
