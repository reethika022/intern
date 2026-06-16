/**
 * Main Application Router
 * Handles all application routes with authentication protection
 * Login is public, all other routes are protected
 */

import { useEffect } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Attendance } from './pages/Attendance';
import { Tasks } from './pages/Tasks';
import { Farmers } from './pages/Farmers';
import { DemoPlots } from './pages/DemoPlots';
import { Dealers } from './pages/Dealers';
import { Bulk } from './pages/Bulk';
import { Issues } from './pages/Issues';
import { Media } from './pages/Media';
import { Reports } from './pages/Reports';
import { Approvals } from './pages/Approvals';
import { Leaderboard } from './pages/Leaderboard';
import { Settings } from './pages/Settings';
import { useAuthStore } from './store/authStore';

/**
 * Create browser router with authentication-aware routing
 * Structure:
 * - /login: Public route for authentication
 * - /: Protected routes inside AppLayout
 * - All other routes redirect to dashboard
 */
const router = createBrowserRouter([
  // Login route - Public, accessible to all
  {
    path: '/login',
    element: <Login />,
  },

  // Protected routes - Wrapped in ProtectedRoute and AppLayout
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // Default redirect to dashboard
      { index: true, element: <Navigate to="/dashboard" replace /> },

      // Main application pages
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'attendance', element: <Attendance /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'farmers', element: <Farmers /> },
      { path: 'demo-plots', element: <DemoPlots /> },
      { path: 'dealers', element: <Dealers /> },
      { path: 'bulk', element: <Bulk /> },
      { path: 'issues', element: <Issues /> },
      { path: 'media', element: <Media /> },
      { path: 'reports', element: <Reports /> },
      { path: 'approvals', element: <Approvals /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'settings', element: <Settings /> },
    ],
  },

  // Catch-all: Redirect unknown routes to dashboard
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

/**
 * App Component
 * Main application wrapper with authentication initialization
 */
export default function App() {
  // Initialize auth state on app mount
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  /**
   * Check authentication status on app initialization
   * This ensures the app state is consistent with stored tokens
   */
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
