/**
 * Navbar Component
 * Displays application header with user menu and logout functionality
 * Provides responsive navigation for mobile and desktop
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Settings, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../ui/Button';
import { SearchBar } from '../common/SearchBar';

export function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Get UI store to control sidebar
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen);

  // Get auth store
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  /**
   * Handle logout — clears auth then hard-redirects to /login.
   * window.location.replace is used for a guaranteed redirect with no
   * React Router race conditions.
   */
  const handleLogout = () => {
    if (isLoggingOut) return;
    console.log('[Navbar] handleLogout clicked');
    setShowMenu(false);
    setIsLoggingOut(true);

    try {
      logout(); // synchronously clears localStorage + Zustand state
      console.log('[Navbar] logout() done, redirecting to /login...');
      // setTimeout(0) lets the event loop flush state before the page navigates
      setTimeout(() => {
        window.location.replace('/login');
      }, 0);
    } catch (error) {
      console.error('[Navbar] logout error:', error);
      toast.error(error.message || 'Logout failed. Please try again.');
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-pulse-border bg-pulse-bg/90 px-4 backdrop-blur lg:px-6">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search Bar */}
      <SearchBar />

      {/* Right Side Icons and User Menu */}
      <div className="ml-auto flex items-center gap-2 relative">
        {/* User Role Badge */}
        <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
          {user?.role || 'User'}
        </span>

        {/* Notifications Button */}
        <Button
          variant="ghost"
          size="sm"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* Settings Button */}
        <Button
          variant="ghost"
          size="sm"
          aria-label="Settings"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            disabled={isLoggingOut}
            aria-label="User menu"
            aria-expanded={showMenu}
          >
            <UserCircle className="h-4 w-4" />
            <span className="hidden sm:inline text-xs truncate max-w-[80px]">
              {user?.name ? user.name.split(' ')[0] : 'User'}
            </span>
          </Button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-pulse-border z-40"
              role="menu"
              aria-orientation="vertical"
            >
              {/* User Info Section */}
              <div className="p-4 border-b border-pulse-border">
                <p className="font-semibold text-pulse-text truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-pulse-muted truncate">{user?.email || 'user@biofactor.com'}</p>
                {user?.role && (
                  <p className="text-xs text-emerald-600 font-medium mt-1">{user.role}</p>
                )}
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {/* Profile Option */}
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowMenu(false);
                  }}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 text-left hover:bg-pulse-bg text-pulse-text flex items-center gap-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  role="menuitem"
                >
                  <UserCircle className="h-4 w-4" />
                  View Profile
                </button>

                {/* Settings Option */}
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowMenu(false);
                  }}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 text-left hover:bg-pulse-bg text-pulse-text flex items-center gap-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  role="menuitem"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>

                {/* Divider */}
                <div className="h-px bg-pulse-border my-1"></div>

                {/* Logout Option */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  role="menuitem"
                >
                  {isLoggingOut ? (
                    <>
                      <span className="inline-block h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
