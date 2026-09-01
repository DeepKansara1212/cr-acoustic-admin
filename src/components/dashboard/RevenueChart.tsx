import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const revenueByMonth: { month: string; revenue: number }[] = [];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface-elevated px-3 py-2 shadow-lg">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-mono text-sm font-semibold text-foreground">
        &#8377;{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export function RevenueChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Monthly revenue trend, last 6 months</CardDescription>
      </CardHeader>
      <div className="h-72 px-3 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueByMonth} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b45309" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#b45309" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(20,22,26,0.08)" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v / 1000}k`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(180,83,9,0.25)" }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#b45309"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
