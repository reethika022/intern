import { Outlet } from "react-router-dom";
import { useUiStore } from "../../store/uiStore";
import { cn } from "../../lib/utils";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function AppLayout() {
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-transparent text-pulse-text">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar />
      </div>
      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebarOpen(false)} aria-label="Close navigation" />
          <div className="relative h-full">
            <Sidebar mobile />
          </div>
        </div>
      ) : null}
      <div className={cn("min-w-0 transition-[padding] duration-300", sidebarCollapsed ? "lg:pl-20" : "lg:pl-72")}>
        <Navbar />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
