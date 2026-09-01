import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useProductStore } from "@/store/productStore";

export function LowStockAlert() {
  const products = useProductStore((s) => s.products);
  const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
        <CardDescription>{lowStock.length} products need restocking</CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-1 px-2 pb-4">
        {lowStock.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted">All products well stocked.</p>
        ) : (
          lowStock.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 hover:bg-surface-elevated"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <AlertTriangle className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                <span className="truncate text-sm text-foreground">{p.name}</span>
              </div>
              <span className="shrink-0 font-mono text-xs font-semibold text-primary">
                {p.stock} left
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
