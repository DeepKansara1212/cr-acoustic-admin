import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  date: string;
};

type OrderStore = {
  orders: Order[];
  updateStatus: (id: string, status: Order["status"]) => void;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      updateStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    { name: "cr-admin-orders" }
  )
);
