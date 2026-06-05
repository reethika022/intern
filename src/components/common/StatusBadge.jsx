import { cn } from "../../lib/utils";

const toneMap = {
  Approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Submitted: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "In Progress": "bg-lime-500/15 text-lime-300 border-lime-500/30",
  Rejected: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  Critical: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  High: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  Medium: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  Low: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

export function StatusBadge({ value, className }) {
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold", toneMap[value] || "border-slate-600 bg-slate-800 text-slate-300", className)}>
      {value}
    </span>
  );
}
