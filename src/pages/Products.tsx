import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useToastStore } from "@/store/toastStore";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/store/productStore";

const brandList = ["Ahuja", "StudioMaster", "DynaTech", "Yamaha", "Pioneer", "Sound Craft", "NX Audio"];

const STATUS_VARIANT: Record<Product["status"], "success" | "muted" | "outline"> = {
  active: "success",
  draft: "outline",
  archived: "muted",
};

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  brand: "",
  price: "",
  stock: "",
  lowStockThreshold: "5",
  status: "active" as Product["status"],
};

export default function Products() {
  const products = useProductStore((s) => s.products);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const categories = useCategoryStore((s) => s.categories);
  const push = useToastStore((s) => s.push);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Product["status"]>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  const openAddDrawer = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setDrawerOpen(true);
  };

  const openEditDrawer = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      price: String(product.price),
      stock: String(product.stock),
      lowStockThreshold: String(product.lowStockThreshold),
      status: product.status,
    });
    setErrors({});
    setDrawerOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    push(`Deleted "${deleteTarget.name}"`, "success");
    setDeleteTarget(null);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Required";
    if (!form.sku.trim()) nextErrors.sku = "Required";
    if (!form.category) nextErrors.category = "Required";
    if (!form.brand) nextErrors.brand = "Required";
    if (!form.price || Number(form.price) <= 0) nextErrors.price = "Enter a valid price";
    if (form.stock === "" || Number(form.stock) < 0) nextErrors.stock = "Enter a valid stock count";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      brand: form.brand,
      price: Number(form.price),
      stock: Number(form.stock),
      lowStockThreshold: Number(form.lowStockThreshold) || 5,
      status: form.status,
    };

    if (editingId) {
      updateProduct(editingId, payload);
      push(`Updated "${payload.name}"`, "success");
    } else {
      addProduct(payload);
      push(`Added "${payload.name}"`, "success");
    }
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72 pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border p-1">
            {(["all", "active", "draft", "archived"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-sm px-3 py-1.5 text-xs font-medium capitalize text-muted transition-colors",
                  statusFilter === s && "bg-surface-elevated text-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <Button onClick={openAddDrawer}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-elevated/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-elevated text-muted-foreground">
                        <ImagePlus className="h-4 w-4" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted">{p.sku}</td>
                  <td className="px-5 py-3 text-muted">{p.category}</td>
                  <td className="px-5 py-3 font-mono text-foreground">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "font-mono",
                        p.stock <= p.lowStockThreshold ? "text-primary" : "text-foreground"
                      )}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={STATUS_VARIANT[p.status]} className="capitalize">
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditDrawer(p)}
                        aria-label={`Edit ${p.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        aria-label={`Delete ${p.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-error/10 hover:text-error"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-muted">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto border-l border-border bg-background"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-heading text-lg font-semibold">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-5 px-6 py-6">
              <button
                type="button"
                className="flex aspect-video items-center justify-center gap-2 rounded-lg border border-dashed border-border text-sm text-muted hover:border-primary/40 hover:text-primary"
              >
                <ImagePlus className="h-5 w-5" /> Upload product images
              </button>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Product Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ahuja SPA-1000 Power Amplifier"
                />
                {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">SKU</label>
                <Input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="e.g. AHJ-SPA1000"
                />
                {errors.sku && <p className="mt-1 text-xs text-error">{errors.sku}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary/60"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-error">{errors.category}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Brand</label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary/60"
                  >
                    <option value="">Select brand</option>
                    {brandList.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  {errors.brand && <p className="mt-1 text-xs text-error">{errors.brand}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Price (₹)</label>
                  <Input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0"
                  />
                  {errors.price && <p className="mt-1 text-xs text-error">{errors.price}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Stock</label>
                  <Input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                  />
                  {errors.stock && <p className="mt-1 text-xs text-error">{errors.stock}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Low Stock Threshold
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as Product["status"] })
                    }
                    className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary/60"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-border px-6 py-5">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingId ? "Save Changes" : "Save Product"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete product?"
          description={`"${deleteTarget.name}" will be permanently removed. This can't be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
