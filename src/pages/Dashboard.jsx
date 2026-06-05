import { Link } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, ClipboardList, FileUp, MapPinned, Sprout, TrendingUp, Users, UserCheck } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { activities, demoActivity, leaderboard, reports, weeklyRegistrations } from "../data/mockData";

const actionLinkClass = "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-pulse-border bg-slate-800 px-4 text-sm font-semibold text-slate-100 transition hover:bg-slate-700";
const primaryActionLinkClass = "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-pulse-primary px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300";

const kpis = [
  { label: "Total Farmers", value: "1,248", icon: Users, trend: "+18% this week" },
  { label: "Demo Plots", value: "186", icon: MapPinned, trend: "+12 demos" },
  { label: "Pending Approvals", value: "34", icon: ClipboardList, trend: "9 urgent" },
  { label: "Attendance %", value: "94%", icon: UserCheck, trend: "+3.2%" },
  { label: "Active Interns", value: "42", icon: Sprout, trend: "6 territories" },
  { label: "Performance Score", value: "88", icon: TrendingUp, trend: "+5 points" },
];

export function Dashboard() {
  return (
    <>
      <PageHeader
        title="Operations Dashboard"
        description="Live pulse of field registrations, demo execution, approvals, attendance, and intern performance."
        actions={
          <>
            <Link className={primaryActionLinkClass} to="/farmers">Add Farmer</Link>
            <Link className={actionLinkClass} to="/demo-plots">Create Demo</Link>
            <Link className={actionLinkClass} to="/media">Upload Media</Link>
            <Link className={actionLinkClass} to="/reports">Submit Report</Link>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {kpis.map((kpi) => <StatCard key={kpi.label} {...kpi} />)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Weekly Registrations</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyRegistrations}>
                <defs>
                  <linearGradient id="farmers" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #1E293B", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="farmers" stroke="#22C55E" fill="url(#farmers)" strokeWidth={3} />
                <Area type="monotone" dataKey="demos" stroke="#84CC16" fill="#84CC1620" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Demo Activity</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoActivity}>
                <CartesianGrid stroke="#1E293B" />
                <XAxis dataKey="crop" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #1E293B", color: "#F8FAFC" }} />
                <Bar dataKey="planned" fill="#1E293B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Approval Queue</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {reports.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border border-pulse-border bg-slate-950 p-3">
                <div><p className="font-semibold">{item.id}</p><p className="text-xs text-pulse-muted">{item.submittedBy} • {item.date}</p></div>
                <StatusBadge value={item.status} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {activities.map((activity) => (
              <div key={activity} className="flex gap-3 rounded-md bg-slate-950 p-3 text-sm text-slate-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pulse-primary" />
                {activity}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Leaderboard Preview</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.slice(0, 4).map((item) => (
              <div key={item.rank} className="flex items-center justify-between rounded-md bg-slate-950 p-3">
                <div><p className="font-semibold">#{item.rank} {item.intern}</p><p className="text-xs text-pulse-muted">{item.farmers} farmers • {item.demos} demos</p></div>
                <span className="font-bold text-pulse-primary">{item.score}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
