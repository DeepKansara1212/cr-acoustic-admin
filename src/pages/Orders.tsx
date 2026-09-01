import { useMemo, useState } from "react";
import { Search, X, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useOrderStore } from "@/store/orderStore";
import { useToastStore } from "@/store/toastStore";
import type { Order } from "@/store/orderStore";
import { formatPrice, cn } from "@/lib/utils";

const STATUS_OPTIONS: Order["status"][] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_VARIANT: Record<Order["status"], "success" | "warning" | "error" | "outline" | "muted"> = {
  delivered: "success",
  shipped: "success",
  processing: "warning",
  confirmed: "outline",
  pending: "muted",
  cancelled: "error",
};

const PAYMENT_VARIANT: Record<Order["paymentStatus"], "success" | "warning" | "error"> = {
  completed: "success",
  pending: "warning",
  failed: "error",
};

export default function Orders() {
  const orders = useOrderStore((s) => s.orders);
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const push = useToastStore((s) => s.push);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Order["status"]>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesQuery =
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  const handleStatusChange = (order: Order, status: Order["status"]) => {
    updateStatus(order.id, status);
    setSelected((s) => (s && s.id === order.id ? { ...s, status } : s));
    push(`${order.id} marked as ${status}`, "success");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72 pl-9"
          />
        </div>
        <div className="flex flex-wrap rounded-md border border-border p-1">
          {(["all", ...STATUS_OPTIONS] as const).map((s) => (
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
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-elevated/50"
                >
                  <td className="px-5 py-3 font-mono text-xs text-foreground">{o.id}</td>
                  <td className="px-5 py-3 text-foreground">{o.customer}</td>
                  <td className="px-5 py-3 text-muted">{o.items}</td>
                  <td className="px-5 py-3 font-mono text-foreground">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3">
                    <Badge variant={PAYMENT_VARIANT[o.paymentStatus]} className="capitalize">
                      {o.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={STATUS_VARIANT[o.status]} className="capitalize">
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-muted">
                    No orders match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto border-l border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-mono text-lg font-semibold text-foreground">{selected.id}</h2>
                <p className="text-xs text-muted">
                  {new Date(selected.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close">
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-6 px-6 py-6">
              <div className="flex items-center gap-3 rounded-md border border-border p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated text-muted">
                  <Package className="h-4.5 w-4.5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-medium text-foreground">{selected.customer}</p>
                  <p className="text-xs text-muted">{selected.items} item(s)</p>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-muted">Payment</p>
                <Badge variant={PAYMENT_VARIANT[selected.paymentStatus]} className="capitalize">
                  {selected.paymentStatus}
                </Badge>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted">Order Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selected, status)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                        selected.status === status
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted hover:border-border-strong hover:text-foreground"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted">Order Total</span>
                <span className="font-mono text-lg font-semibold text-foreground">
                  {formatPrice(selected.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
