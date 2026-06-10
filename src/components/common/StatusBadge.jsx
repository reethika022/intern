import { cn } from "../../lib/utils";

const toneMap = {
  Approved: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Active: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Submitted: "bg-sky-500/15 text-sky-700 border-sky-500/30",
  Pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "In Progress": "bg-lime-500/15 text-lime-700 border-lime-500/30",
  Rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  Critical: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  High: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  Medium: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
  Low: "bg-slate-500/15 text-slate-700 border-slate-500/30",
};

export function StatusBadge({ value, className }) {
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold", toneMap[value] || "border-slate-300 bg-slate-100 text-slate-700", className)}>
      {value}
    </span>
  );
}
