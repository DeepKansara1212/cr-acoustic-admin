import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div>
        <h1 className="font-heading text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="w-64 pl-9" />
        </div>
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-foreground"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-elevated font-mono text-xs font-semibold text-foreground">
          CR
        </div>
      </div>
    </header>
  );
}
