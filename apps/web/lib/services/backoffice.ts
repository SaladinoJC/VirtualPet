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

function writeOrders(orders: Order[]) {
  if (!isClient()) return;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export async function listPending(token?: string): Promise<Order[]> {
  if (useMock) return Promise.resolve(readOrders().filter((o) => o.status === "CONFIRMED"));
  return api<Order[]>('/api/v1/backoffice/orders?status=CONFIRMED', { token });
}

export async function updateStatus(id: string, status: string, token?: string): Promise<void> {
  if (useMock) {
    const orders = readOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx >= 0) {
      orders[idx].status = status;
      writeOrders(orders);
    }
    return Promise.resolve();
  }
  await api(`/api/v1/backoffice/orders/${id}/status`, { method: 'PATCH', token, body: JSON.stringify({ status }) });
}

export const backofficeService = { listPending, updateStatus };

export default backofficeService;
