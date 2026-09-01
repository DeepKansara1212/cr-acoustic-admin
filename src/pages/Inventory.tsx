import { useMemo, useState } from "react";
import { AlertTriangle, Minus, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/productStore";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/lib/utils";

export default function Inventory() {
  const products = useProductStore((s) => s.products);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const push = useToastStore((s) => s.push);
  const [query, setQuery] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const filtered = useMemo(() => {
    return products
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()))
      .filter((p) => !onlyLowStock || p.stock <= p.lowStockThreshold)
      .sort((a, b) => a.stock - b.stock);
  }, [products, query, onlyLowStock]);

  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;

  const adjustStock = (id: string, currentStock: number, delta: number) => {
    const next = Math.max(0, currentStock + delta);
    updateProduct(id, { stock: next });
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftStock, setDraftStock] = useState("");

  const startEdit = (id: string, stock: number) => {
    setEditingId(id);
    setDraftStock(String(stock));
  };

  const saveEdit = (id: string, name: string) => {
    const value = Number(draftStock);
    if (Number.isFinite(value) && value >= 0) {
      updateProduct(id, { stock: Math.round(value) });
      push(`Updated stock for "${name}"`, "success");
    }
    setEditingId(null);
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
        <button
          onClick={() => setOnlyLowStock((v) => !v)}
          className={cn(
            "flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
            onlyLowStock
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted hover:text-foreground"
          )}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {lowStockCount} low stock {onlyLowStock ? "· showing only these" : ""}
        </button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Threshold</th>
                <th className="px-5 py-3 font-medium">Current Stock</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const low = p.stock <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-elevated/50">
                    <td className="px-5 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted">{p.sku}</td>
                    <td className="px-5 py-3 font-mono text-muted">{p.lowStockThreshold}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => adjustStock(p.id, p.stock, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:text-foreground"
                          aria-label={`Decrease stock for ${p.name}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        {editingId === p.id ? (
                          <input
                            autoFocus
                            type="number"
                            min={0}
                            value={draftStock}
                            onChange={(e) => setDraftStock(e.target.value)}
                            onBlur={() => saveEdit(p.id, p.name)}
                            onKeyDown={(e) => e.key === "Enter" && saveEdit(p.id, p.name)}
                            className="w-16 rounded-md border border-primary bg-surface px-2 py-1 text-center font-mono text-sm text-foreground focus-visible:outline-none"
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(p.id, p.stock)}
                            className={cn(
                              "w-16 rounded-md border border-transparent px-2 py-1 text-center font-mono text-sm hover:border-border",
                              low ? "text-primary" : "text-foreground"
                            )}
                          >
                            {p.stock}
                          </button>
                        )}
                        <button
                          onClick={() => adjustStock(p.id, p.stock, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted hover:text-foreground"
                          aria-label={`Increase stock for ${p.name}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {low ? (
                        <Badge variant="warning">Low Stock</Badge>
                      ) : (
                        <Badge variant="success">In Stock</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-muted">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
