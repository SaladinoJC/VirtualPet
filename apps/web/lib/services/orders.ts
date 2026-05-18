import { api } from "@/lib/api";
import type { Order } from "@/lib/types";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === "1";
const ORDERS_KEY = "vp_mock_orders";

function isClient() {
  return typeof window !== "undefined";
}

function readOrders(): Order[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export async function listOrders(token?: string): Promise<Order[]> {
  if (useMock) return Promise.resolve(readOrders());
  return api<Order[]>('/api/v1/orders', { token });
}

export async function getOrder(id: string, token?: string): Promise<Order> {
  if (useMock) {
    const orders = readOrders();
    const o = orders.find((x) => x.id === id) ?? orders[0];
    return Promise.resolve(o);
  }
  return api<Order>(`/api/v1/orders/${id}`, { token });
}

export const ordersService = { listOrders, getOrder };

export default ordersService;
