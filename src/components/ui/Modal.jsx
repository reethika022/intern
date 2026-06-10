import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export function Modal({ open, onClose, title, children, className }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className={cn("max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg border border-pulse-border bg-pulse-card shadow-2xl", className)}>
        <div className="flex items-center justify-between border-b border-pulse-border px-5 py-4">
          <h2 className="text-lg font-semibold text-pulse-text">{title}</h2>
          <Button size="sm" variant="ghost" onClick={onClose} aria-label="Close modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[calc(90vh-72px)] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
