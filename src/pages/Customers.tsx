import { useMemo, useState } from "react";
import { Search, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCustomerStore } from "@/store/customerStore";
import { useToastStore } from "@/store/toastStore";
import { formatPrice } from "@/lib/utils";

export default function Customers() {
  const customers = useCustomerStore((s) => s.customers);
  const toggleActive = useCustomerStore((s) => s.toggleActive);
  const push = useToastStore((s) => s.push);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      ),
    [customers, query]
  );

  const handleToggle = (id: string, name: string, isActive: boolean) => {
    toggleActive(id);
    push(`${name} ${isActive ? "deactivated" : "activated"}`, "success");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-72 pl-9"
        />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Total Spent</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface-elevated/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-elevated text-muted-foreground">
                        <User className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {new Date(c.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 font-mono text-foreground">{c.orders}</td>
                  <td className="px-5 py-3 font-mono text-foreground">{formatPrice(c.totalSpent)}</td>
                  <td className="px-5 py-3">
                    <Badge variant={c.isActive ? "success" : "muted"}>
                      {c.isActive ? "Active" : "Deactivated"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleToggle(c.id, c.name, c.isActive)}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-border-strong hover:text-foreground"
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm text-muted">
                    No customers match your search.
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
