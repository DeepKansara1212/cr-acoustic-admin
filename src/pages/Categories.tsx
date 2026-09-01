import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, FolderTree } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import { useToastStore } from "@/store/toastStore";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Category } from "@/store/categoryStore";

const emptyForm = { name: "", description: "" };

export default function Categories() {
  const categories = useCategoryStore((s) => s.categories);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const updateCategory = useCategoryStore((s) => s.updateCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);
  const toggleActive = useCategoryStore((s) => s.toggleActive);
  const products = useProductStore((s) => s.products);
  const push = useToastStore((s) => s.push);

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, [products]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setDrawerOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({ name: category.name, description: category.description });
    setErrors({});
    setDrawerOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    const count = productCounts[category.name] ?? 0;
    if (count > 0) {
      push(`Can't delete "${category.name}" — ${count} product(s) still use it`, "error");
      return;
    }
    setDeleteTarget(category);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id);
    push(`Deleted "${deleteTarget.name}"`, "success");
    setDeleteTarget(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: "Required" });
      return;
    }
    if (editingId) {
      updateCategory(editingId, { name: form.name.trim(), description: form.description.trim() });
      push(`Updated "${form.name}"`, "success");
    } else {
      addCategory({ name: form.name.trim(), description: form.description.trim() });
      push(`Added "${form.name}"`, "success");
    }
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.id} className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-elevated text-primary">
                  <FolderTree className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">/{c.slug}</p>
                </div>
              </div>
              <Badge
                variant={c.isActive ? "success" : "muted"}
                className="cursor-pointer capitalize"
                onClick={() => toggleActive(c.id)}
              >
                {c.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="line-clamp-2 text-sm text-muted">{c.description}</p>
            <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted">{productCounts[c.name] ?? 0} products</span>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(c)}
                  aria-label={`Edit ${c.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(c)}
                  aria-label={`Delete ${c.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-error/10 hover:text-error"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto border-l border-border bg-background"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-heading text-lg font-semibold">
                {editingId ? "Edit Category" : "Add Category"}
              </h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-5 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Category Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Amplifier"
                />
                {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description shown to customers..."
                  className="w-full resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/60"
                />
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
                {editingId ? "Save Changes" : "Save Category"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete category?"
          description={`"${deleteTarget.name}" will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
