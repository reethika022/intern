import { Bell, Menu, Settings, UserCircle } from "lucide-react";
import { useUiStore } from "../../store/uiStore";
import { Button } from "../ui/Button";
import { SearchBar } from "../common/SearchBar";

export function Navbar() {
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-pulse-border bg-pulse-bg/90 px-4 backdrop-blur lg:px-6">
      <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileSidebarOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <SearchBar />
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 sm:inline-flex">Field Admin</span>
        <Button variant="ghost" size="sm" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm">
          <UserCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Uma</span>
        </Button>
      </div>
    </header>
  );
}
