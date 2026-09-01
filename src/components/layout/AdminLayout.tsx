import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Overview of your store performance" },
  "/products": { title: "Products", subtitle: "Manage your product catalog" },
  "/categories": { title: "Categories", subtitle: "Organize your product categories" },
  "/orders": { title: "Orders", subtitle: "Track and fulfil customer orders" },
  "/inventory": { title: "Inventory", subtitle: "Monitor and adjust stock levels" },
  "/customers": { title: "Customers", subtitle: "View and manage customer accounts" },
};

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const meta = TITLES[location.pathname] ?? { title: "CR Acoustic Admin", subtitle: "" };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
