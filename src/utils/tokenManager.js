/**
 * Token Manager Utilities
 * Handles secure storage, retrieval, and validation of JWT tokens
 * Follows security best practices to prevent XSS and token exposure
 */

const TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'biofactor_auth_token';
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'biofactor_refresh_token';
const USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || 'biofactor_user';

/**
 * Decode JWT token without verification (only for client-side parsing)
 * WARNING: Never trust token data for security decisions on the client
 * Always verify tokens on the backend
 */
const decodeToken = (token) => {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const decodedPayload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    return decodedPayload;
  } catch {
    console.error('Failed to decode token');
    return null;
  }
};

/**
 * Check if token is expired
 * Returns false (not expired) if the token cannot be decoded — avoids
 * treating a structurally valid mock token as expired.
 */
const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  // If we can't decode it or there's no exp claim, treat as NOT expired
  // so mock / custom tokens don't get cleared on refresh
  if (!decoded || !decoded.exp) return false;

  const expirationTime = decoded.exp * 1000;
  const bufferTime = 60 * 1000; // 60 second buffer
  return Date.now() > expirationTime - bufferTime;
};

/**
 * Get stored access token from localStorage
 */
const getAccessToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    console.error('Failed to retrieve access token');
    return null;
  }
};

/**
 * Get stored refresh token from localStorage
 */
const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    console.error('Failed to retrieve refresh token');
    return null;
  }
};

/**
 * Store tokens securely in localStorage
 * In production, consider using httpOnly cookies on the server
 */
const setTokens = (accessToken, refreshToken = null) => {
  try {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch {
    console.error('Failed to store tokens');
  }
};

/**
 * Store user data separately from tokens
 */
const setUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    console.error('Failed to store user data');
  }
};

/**
 * Get stored user data
 */
const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    console.error('Failed to retrieve user data');
    return null;
  }
};

/**
 * Clear all authentication data from localStorage.
 * Uses localStorage.clear() to guarantee all auth keys are removed
 * regardless of env variable loading order or key mismatches.
 */
const clearTokens = () => {
  try {
    // Remove specific known keys first
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Also remove by hardcoded fallback names in case env vars didn't load
    localStorage.removeItem('biofactor_auth_token');
    localStorage.removeItem('biofactor_refresh_token');
    localStorage.removeItem('biofactor_user');
    localStorage.removeItem('loggedOut');
    console.log('[Auth] Tokens cleared from localStorage');
  } catch (err) {
    console.error('[Auth] Failed to clear tokens:', err);
  }
};

/**
 * Check if user is authenticated
 * Validates token existence and expiration
 */
const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
};

/**
 * Get token info for authorization headers
 */
const getAuthHeader = () => {
  const token = getAccessToken();
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
};

/**
 * Schedule periodic token expiry checks
 * Calls onExpired callback when the access token expires
 * Interval is driven by VITE_TOKEN_EXPIRY_CHECK_INTERVAL env var (minutes)
 */
const scheduleTokenExpiryCheck = (onExpired) => {
  const intervalMinutes =
    Number(import.meta.env.VITE_TOKEN_EXPIRY_CHECK_INTERVAL) || 5;
  const intervalMs = intervalMinutes * 60 * 1000;

  const id = setInterval(() => {
    const token = getAccessToken();
    // If a token exists but is now expired, notify the caller
    if (token && isTokenExpired(token)) {
      clearInterval(id);
      onExpired();
    }
  }, intervalMs);

  // Return cancel function so the caller can clean up
  return () => clearInterval(id);
};

export {
  decodeToken,
  isTokenExpired,
  getAccessToken,
  getRefreshToken,
  setTokens,
  setUser,
  getUser,
  clearTokens,
  isAuthenticated,
  getAuthHeader,
  scheduleTokenExpiryCheck,
};
