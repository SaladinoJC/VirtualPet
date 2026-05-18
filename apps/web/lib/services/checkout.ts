import { api } from "@/lib/api";
import type { Order } from "@/lib/types";

export type CheckoutResponse = { checkoutSessionId: string; paymentUrl: string; status: string; orderId: string | null };

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

export async function createCheckout(token: string, cartSession?: string, idempotencyKey?: string): Promise<CheckoutResponse> {
  if (useMock) {
    const externalId = crypto ? crypto.randomUUID() : String(Date.now());
    return Promise.resolve({ checkoutSessionId: externalId, paymentUrl: `http://localhost:3000/checkout/mock?externalId=${externalId}`, status: "PENDING", orderId: null });
  }
  return api<CheckoutResponse>("/api/v1/checkout", {
    method: "POST",
    token,
    cartSession,
    headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
  });
}

export async function confirmMock(externalId: string): Promise<Order> {
  if (useMock) {
    const orders = readOrders();
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      status: "CONFIRMED",
      total: 1000,
      createdAt: new Date().toISOString(),
      items: [{ productName: "Producto mock", quantity: 1 } as any],
    } as Order;
    orders.push(newOrder);
    writeOrders(orders);
    return Promise.resolve(newOrder);
  }
  return api<Order>("/api/v1/checkout/mock/confirm", { method: "POST", body: JSON.stringify({ externalId }) });
}

export const checkoutService = { createCheckout, confirmMock };

export default checkoutService;
