import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CategoryDonut } from "@/components/dashboard/CategoryDonut";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { useOrderStore } from "@/store/orderStore";
import { useProductStore } from "@/store/productStore";
import { useCustomerStore } from "@/store/customerStore";
import { formatPrice } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export default function Dashboard() {
  const scope = useRef<HTMLDivElement>(null);
  const orders = useOrderStore((s) => s.orders);
  const products = useProductStore((s) => s.products);
  const customers = useCustomerStore((s) => s.customers);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  useGSAP(
    () => {
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "cubic-bezier(0.16,1,0.3,1)", stagger: 0.06 }
      );
    },
    { scope }
  );

  return (
    <div ref={scope} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="stat-card">
          <StatCard label="Total Revenue" value={formatPrice(totalRevenue)} change={7.4} icon={DollarSign} />
        </div>
        <div className="stat-card">
          <StatCard label="Orders" value={String(orders.length)} change={4.1} icon={ShoppingBag} />
        </div>
        <div className="stat-card">
          <StatCard label="Products" value={String(products.length)} change={2.2} icon={Package} />
        </div>
        <div className="stat-card">
          <StatCard label="Customers" value={String(customers.length)} change={-1.3} icon={Users} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <RevenueChart />
        <CategoryDonut />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrders />
        </div>
        <LowStockAlert />
      </div>
    </div>
  );
}
