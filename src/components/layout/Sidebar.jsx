import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Camera,
  CheckSquare,
  CircleCheckBig,
  ClipboardCheck,
  Gauge,
  LogOut,
  MapPinned,
  Menu,
  Settings,
  ShieldAlert,
  Store,
  Trophy,
  Upload,
  Users,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { useUiStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: Gauge },
  { label: "Attendance", path: "/attendance", icon: ClipboardCheck },
  { label: "Tasks", path: "/tasks", icon: CheckSquare },
  { label: "Farmers", path: "/farmers", icon: Users },
  { label: "Demo Plots", path: "/demo-plots", icon: MapPinned },
  { label: "Dealers", path: "/dealers", icon: Store },
  { label: "Bulk Import", path: "/bulk", icon: Upload },
  { label: "Issues", path: "/issues", icon: ShieldAlert },
  { label: "Media", path: "/media", icon: Camera },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Approvals", path: "/approvals", icon: CircleCheckBig },
  { label: "Leaderboard", path: "/leaderboard", icon: Trophy },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar({ mobile = false }) {
  const { sidebarCollapsed, setSidebarCollapsed, setMobileSidebarOpen } = useUiStore();
  const collapsed = !mobile && sidebarCollapsed;

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Helper to extract initials from the user's name
  const getUserInitials = () => {
    if (!user?.name) return "UR";
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      logout();
      setTimeout(() => {
        window.location.replace("/login");
      }, 0);
    } catch (error) {
      console.error("[Sidebar] Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className={cn("flex h-full flex-col border-r border-pulse-border bg-pulse-card", collapsed ? "w-20" : "w-72", mobile && "w-80 max-w-[86vw]")}>
      <div className="flex h-16 items-center justify-between border-b border-pulse-border px-4">
        <div className={cn("min-w-0", collapsed && "hidden")}>
          <p className="text-sm font-black tracking-wide text-pulse-text">BIOFACTOR PULSE</p>
          <p className="truncate text-xs text-pulse-muted">Internship & Field Operations</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => (mobile ? setMobileSidebarOpen(false) : setSidebarCollapsed(!sidebarCollapsed))}>
          {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => mobile && setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900",
                isActive && "bg-emerald-500/15 text-pulse-primary ring-1 ring-emerald-500/20",
                collapsed && "justify-center px-0"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className={cn("truncate", collapsed && "hidden")}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-pulse-border p-4">
        <div className={cn("mb-3 flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pulse-primary font-bold text-white">
            {getUserInitials()}
          </div>
          <div className={cn("min-w-0", collapsed && "hidden")}>
            <p className="truncate text-sm font-semibold text-pulse-text">{user?.name || "Uma Reethika"}</p>
            <p className="text-xs text-pulse-muted">{user?.role || "Field Intern"}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          className={cn("w-full flex items-center justify-center gap-2", collapsed && "px-0")}
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <span className="inline-block h-3.5 w-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>
              <span className={cn(collapsed && "hidden")}>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              <span className={cn(collapsed && "hidden")}>Logout</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
