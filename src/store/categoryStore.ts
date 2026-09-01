import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type CategoryStore = {
  categories: Category[];
  addCategory: (data: { name: string; description: string }) => Category;
  updateCategory: (id: string, data: Partial<Omit<Category, "id" | "slug">>) => void;
  deleteCategory: (id: string) => void;
  toggleActive: (id: string) => void;
};

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      categories: [],
      addCategory: (data) => {
        const category: Category = {
          id: crypto.randomUUID(),
          name: data.name,
          slug: slugify(data.name),
          description: data.description,
          isActive: true,
        };
        set((s) => ({ categories: [...s.categories, category] }));
        return category;
      },
      updateCategory: (id, data) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
      toggleActive: (id) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        })),
    }),
    { name: "cr-admin-categories" }
  )
);
