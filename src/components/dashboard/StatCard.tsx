import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
}) {
  const positive = (change ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted">{label}</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-elevated text-primary">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
        </span>
      </div>
      {change !== undefined && (
        <div
          className={cn(
            "mt-3 flex items-center gap-1 text-xs font-medium",
            positive ? "text-accent" : "text-error"
          )}
        >
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(change)}% vs last month
        </div>
      )}
    </Card>
  );
}
