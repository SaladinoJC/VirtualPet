"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/api";
import ordersService from "@/lib/services/orders";
import { getToken } from "@/lib/auth";
import type { Order } from "@/lib/types";

const STEPS = ["CONFIRMED", "PREPARED", "IN_TRANSIT", "DELIVERED"] as const;
const LABELS: Record<string, string> = {
  CONFIRMED: "Confirmado",
  PREPARED: "Preparado",
  IN_TRANSIT: "En camino",
  DELIVERED: "Entregado",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token || !id) return;
    ordersService.getOrder(id, token).then(setOrder);
  }, [id]);

  if (!order) return <p className="p-10 text-center">Cargando...</p>;

  const currentIdx = STEPS.indexOf(order.status as (typeof STEPS)[number]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Pedido {order.id.slice(0, 8)}</h1>
      <ol className="mt-8 space-y-4">
        {STEPS.map((step, idx) => (
          <li
            key={step}
            className={`flex items-center gap-3 ${idx <= currentIdx ? "text-emerald-700" : "text-zinc-400"}`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                idx <= currentIdx ? "bg-emerald-600 text-white" : "bg-zinc-200"
              }`}
            >
              {idx + 1}
            </span>
            {LABELS[step]}
          </li>
        ))}
      </ol>
      <ul className="mt-8 space-y-2 border-t pt-6">
        {order.items.map((i) => (
          <li key={i.variantId} className="flex justify-between text-sm">
            <span>
              {i.productName} × {i.quantity}
            </span>
            <span>{formatPrice(i.unitPrice * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right text-xl font-bold">Total: {formatPrice(order.total)}</p>
    </section>
  );
}
