import { ArrowUpRight } from "lucide-react";
import { Card } from "../ui/Card";

export function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-pulse-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-pulse-text">{value}</p>
        </div>
        <div className="rounded-md bg-emerald-500/12 p-2 text-pulse-primary">{Icon ? <Icon className="h-5 w-5" /> : null}</div>
      </div>
      {trend ? (
        <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-300">
          <ArrowUpRight className="h-3.5 w-3.5" />
          {trend}
        </div>
      ) : null}
    </Card>
  );
}
