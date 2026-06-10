import { useState } from "react";
import { Bell, LogOut, Menu, Settings, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useUiStore } from "../../store/uiStore";
import { Button } from "../ui/Button";
import { SearchBar } from "../common/SearchBar";

export function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen);
  const user = {
    name: "Uma Reethika",
    email: "user@biofactor.com",
  };

  const handleLogout = () => {
    setShowMenu(false);
    toast("Logout is disabled for now, will be enabled later.");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-pulse-border bg-pulse-bg/90 px-4 backdrop-blur lg:px-6">
      <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileSidebarOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <SearchBar />
      <div className="ml-auto flex items-center gap-2 relative">
        <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
          Field Admin
        </span>
        <Button variant="ghost" size="sm" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Button>
        <div className="relative">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
          >
            <UserCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Uma</span>
          </Button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-pulse-border z-40">
              <div className="p-4 border-b border-pulse-border">
                <p className="font-semibold text-pulse-text">{user.name}</p>
                <p className="text-xs text-pulse-muted">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-pulse-bg text-pulse-text flex items-center gap-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
