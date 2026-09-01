import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  status: "active" | "draft" | "archived";
  updatedAt: string;
};

type ProductStore = {
  products: Product[];
  addProduct: (data: Omit<Product, "id" | "updatedAt">) => Product;
  updateProduct: (id: string, data: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: string) => void;
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (data) => {
        const product: Product = {
          ...data,
          id: crypto.randomUUID(),
          updatedAt: new Date().toISOString().slice(0, 10),
        };
        set((s) => ({ products: [product, ...s.products] }));
        return product;
      },
      updateProduct: (id, data) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : p
          ),
        })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
    }),
    { name: "cr-admin-products" }
  )
);
