import { cn } from "../../lib/utils";

const variants = {
  primary: "bg-pulse-primary text-white hover:bg-emerald-300",
  secondary: "bg-white text-slate-900 hover:bg-slate-50 border border-pulse-border",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-rose-500 text-white hover:bg-rose-400",
};

export function Button({ className, variant = "primary", size = "md", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
