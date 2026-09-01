import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrderStore } from "@/store/orderStore";
import type { Order } from "@/store/orderStore";
import { formatPrice } from "@/lib/utils";

const STATUS_VARIANT: Record<Order["status"], "success" | "warning" | "error" | "outline" | "muted"> = {
  delivered: "success",
  shipped: "success",
  processing: "warning",
  confirmed: "outline",
  pending: "muted",
  cancelled: "error",
};

export function RecentOrders() {
  const orders = useOrderStore((s) => s.orders);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest {orders.length} orders across the store</CardDescription>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-border text-left text-xs text-muted">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-surface-elevated/50">
                <td className="px-5 py-3 font-mono text-xs text-foreground">{o.id}</td>
                <td className="px-5 py-3 text-foreground">{o.customer}</td>
                <td className="px-5 py-3 font-mono text-foreground">{formatPrice(o.total)}</td>
                <td className="px-5 py-3">
                  <Badge variant={STATUS_VARIANT[o.status]} className="capitalize">
                    {o.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
