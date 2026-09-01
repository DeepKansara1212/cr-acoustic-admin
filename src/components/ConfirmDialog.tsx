import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  destructive = true,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-[0_24px_64px_rgba(20,22,26,0.2)]">
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="absolute right-4 top-4 text-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            destructive ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
          }`}
        >
          <AlertTriangle className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 font-heading text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1.5 text-sm text-muted">{description}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            className="flex-1"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
