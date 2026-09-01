import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Customer = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  orders: number;
  totalSpent: number;
  isActive: boolean;
};

type CustomerStore = {
  customers: Customer[];
  toggleActive: (id: string) => void;
};

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      customers: [],
      toggleActive: (id) =>
        set((s) => ({
          customers: s.customers.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        })),
    }),
    { name: "cr-admin-customers" }
  )
);
