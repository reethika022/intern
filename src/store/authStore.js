/**
 * Authentication Store
 * Manages authentication state using Zustand
 * Handles JWT tokens, user data, and authentication lifecycle
 */

import { create } from 'zustand';
import {
  getAccessToken,
  setTokens,
  setUser,
  getUser,
  clearTokens,
  isTokenExpired,
  isAuthenticated as checkAuthStatus,
  scheduleTokenExpiryCheck,
} from '../utils/tokenManager';
import { login as apiLogin, logout as apiLogout } from '../lib/api';

// Note: MOCK_TOKEN/MOCK_USER are used only by the mock api.js login function.
// The seedMockAuth auto-login has been removed so users must log in manually.
// Demo credentials on the login page: demo@biofactor.com / demo123

/**
 * Initialize auth state from localStorage on app start.
 * If a valid, unexpired token exists (e.g. from a previous session),
 * the user is restored as authenticated. Otherwise they must log in.
 */
const initializeAuthState = () => {
  try {
    const token = getAccessToken();
    const user = getUser();

    if (token && !isTokenExpired(token) && user) {
      return { user, isAuthenticated: true, isLoading: false, error: null };
    }

    // Token expired or missing — clear stale data and require login
    if (token || user) clearTokens();

    return { user: null, isAuthenticated: false, isLoading: false, error: null };
  } catch {
    return { user: null, isAuthenticated: false, isLoading: false, error: null };
  }
};

/**
 * Zustand store for authentication state management
 */
export const useAuthStore = create((set, get) => ({
  ...initializeAuthState(),

  // Holds the cancel function returned by scheduleTokenExpiryCheck
  _cancelExpiryCheck: null,

  /**
   * LOGIN - Authenticate user with credentials
   * Starts token expiry polling after successful login
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiLogin(email, password);

      if (!response.user || !response.accessToken) {
        throw new Error('Invalid response from server');
      }

      setTokens(response.accessToken, response.refreshToken || null);
      setUser(response.user);

      // Start polling for token expiry; auto-logout when it fires
      const cancel = scheduleTokenExpiryCheck(() => get().logout());
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        _cancelExpiryCheck: cancel,
      });

      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      set({ user: null, isAuthenticated: false, isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * LOGOUT - Clear authentication and user data
   * Notifies backend, cancels expiry polling, and clears all local storage
   */
  logout: () => {
    console.log('[Auth] logout() called');
    // Cancel any active expiry check
    const { _cancelExpiryCheck } = get();
    if (_cancelExpiryCheck) _cancelExpiryCheck();

    // Synchronously clear all auth data from localStorage and Zustand store.
    clearTokens();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _cancelExpiryCheck: null,
    });
    console.log('[Auth] State cleared, isAuthenticated=false');

    // Notify backend in the background — failure is non-fatal
    apiLogout().catch((err) =>
      console.warn('[Auth] Logout notification failed (non-fatal):', err)
    );
  },

  /**
   * CHECK AUTH STATUS - Verify if user is still authenticated
   * Called on app initialization to sync state with stored tokens
   */
  checkAuthStatus: () => {
    const isAuth = checkAuthStatus();
    const user = getUser();

    if (!isAuth) {
      set({ user: null, isAuthenticated: false });
    } else if (isAuth && !get().isAuthenticated) {
      // Resume expiry polling if re-hydrated from localStorage
      const cancel = scheduleTokenExpiryCheck(() => get().logout());
      set({ user, isAuthenticated: true, _cancelExpiryCheck: cancel });
    }

    return isAuth;
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    setUser(updatedUser);
    set({ user: updatedUser });
  },
}));
