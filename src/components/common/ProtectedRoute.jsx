/**
 * Protected Route Component
 * Ensures only authenticated users can access protected pages.
 * Redirects unauthenticated users to /login.
 * Shows a full-screen spinner while the auth check is in progress.
 */

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Show full-screen spinner while auth state is being resolved
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pulse-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pulse-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
