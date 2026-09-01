import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const categoryBreakdown: { category: string; value: number }[] = [];

const COLORS = ["#b45309", "#0d9488", "#2563eb", "#9ca3af", "#454b57"];

export function CategoryDonut() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
        <CardDescription>Share of revenue this month</CardDescription>
      </CardHeader>
      <div className="h-72 px-3 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryBreakdown}
              dataKey="value"
              nameKey="category"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              stroke="none"
            >
              {categoryBreakdown.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid rgba(20,22,26,0.08)",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 8px 24px rgba(20,22,26,0.12)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 px-5 pb-5">
        {categoryBreakdown.map((c, i) => (
          <div key={c.category} className="flex items-center gap-1.5 text-xs text-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            {c.category}
          </div>
        ))}
      </div>
    </Card>
  );
}
