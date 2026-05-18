"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import checkoutService from "@/lib/services/checkout";
import type { Order } from "@/lib/types";

function MockCheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const externalId = params.get("externalId") ?? "";

  async function confirm() {
    setLoading(true);
    try {
      await checkoutService.confirmMock(externalId);
      router.push("/account/orders");
    } catch {
      alert("Error al confirmar pago");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Pago simulado</h1>
      <p className="mt-4 text-zinc-600">Modo demo — sin pasarela real.</p>
      <button
        type="button"
        onClick={confirm}
        disabled={loading || !externalId}
        className="mt-8 rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white"
      >
        {loading ? "Confirmando..." : "Simular pago exitoso"}
      </button>
    </section>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense>
      <MockCheckoutInner />
    </Suspense>
  );
}
