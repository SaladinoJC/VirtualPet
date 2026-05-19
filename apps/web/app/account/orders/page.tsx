"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/api";
import ordersService from "@/lib/services/orders";
import { getToken } from "@/lib/auth";
import type { Order } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmado",
  PREPARED: "Preparado",
  IN_TRANSIT: "En camino",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    ordersService
      .listOrders(token)
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Mis pedidos</h1>
      <ul className="mt-8 space-y-4">
        {orders.map((o) => (
          <li key={o.id} className="rounded-xl border bg-white p-4">
            <Link href={`/account/orders/${o.id}`} className="flex justify-between">
              <span className="font-mono text-sm">{o.id.slice(0, 8)}…</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
                {STATUS_LABELS[o.status] ?? o.status}
              </span>
            </Link>
            <p className="mt-2 font-bold">{formatPrice(o.total)}</p>
          </li>
        ))}
      </ul>
      {orders.length === 0 && <p className="mt-8 text-zinc-500">Aún no tenés pedidos.</p>}
    </section>
  );
}
