/**
 * API Service Layer
 * Handles all HTTP requests with token management, error handling, and retry logic
 * Follows RESTful principles and security best practices
 */

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  getAuthHeader,
} from '../utils/tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * API Error class for consistent error handling
 */
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'APIError';
  }
}

/**
 * Make HTTP request with automatic token management
 * Includes error handling, retry logic for token refresh, and response validation
 */
const makeRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    requiresAuth = true,
    retryCount = 0,
    maxRetries = 1,
  } = options;

  try {
    const isFormData = body instanceof FormData;
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    Object.assign(headers, options.headers);

    // Add authorization header if token exists
    if (requiresAuth) {
      const authHeader = getAuthHeader();
      if (authHeader) {
        Object.assign(headers, authHeader);
      }
    }

    const requestOptions = {
      method,
      headers,
    };

    // Add body for methods that support it
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && requiresAuth && retryCount < maxRetries) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request with new token
        return makeRequest(endpoint, {
          ...options,
          retryCount: retryCount + 1,
        });
      } else {
        // Refresh failed, clear auth and redirect to login
        clearTokens();
        window.location.href = '/login';
        throw new APIError('Session expired. Please login again.', 401);
      }
    }

    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `HTTP Error: ${response.status} ${response.statusText}`;
      throw new APIError(errorMessage, response.status, errorData);
    }

    // Parse and return response data
    return await response.json();
  } catch (error) {
    // Differentiate between network errors and API errors
    if (error instanceof APIError) {
      throw error;
    }

    console.error('API Request Error:', error);
    throw new APIError(
      error.message || 'Network error. Please try again.',
      0,
      error
    );
  }
};

/**
 * Refresh access token using refresh token
 * Called when access token expires
 */
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.warn('Token refresh failed');
      return false;
    }

    const data = await response.json();

    // Update tokens with new access token
    if (data.accessToken) {
      setTokens(data.accessToken, data.refreshToken || refreshToken);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

/**
 * LOGIN - MOCK (no backend needed)
 * Returns a fake token and user so the app works without a real API.
 * TODO: Replace with real API call when backend is ready:
 *   return makeRequest('/auth/login', { method: 'POST', body: { email, password }, requiresAuth: false });
 */
const login = async (email, password) => {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  // Mock JWT — expires year 2099, safe for demo use
  const mockToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    btoa(JSON.stringify({ sub: '1', name: 'Demo User', exp: 4102444800 })) +
    '.mock-signature';

  return {
    accessToken: mockToken,
    refreshToken: 'mock-refresh-token',
    user: {
      id: '1',
      name: 'Demo User',
      email: email || 'demo@biofactor.com',
      role: 'Admin',
    },
  };
};

/**
 * LOGOUT - MOCK (no backend needed)
 * TODO: Replace with real API call when backend is ready.
 */
const logout = async () => {
  // No backend call needed in mock mode — authStore clears tokens
  clearTokens();
};

/**
 * GET USER PROFILE - Fetch current user information
 */
const getUserProfile = async () => {
  return makeRequest('/auth/me', {
    method: 'GET',
    requiresAuth: true,
  });
};

/**
 * VERIFY TOKEN - Check if current token is valid
 */
const verifyToken = async () => {
  return makeRequest('/auth/verify', {
    method: 'POST',
    requiresAuth: true,
  });
};

/**
 * Generic GET request
 */
const get = async (endpoint, options = {}) => {
  return makeRequest(endpoint, {
    method: 'GET',
    ...options,
  });
};

/**
 * Generic POST request
 */
const post = async (endpoint, body, options = {}) => {
  return makeRequest(endpoint, {
    method: 'POST',
    body,
    ...options,
  });
};

/**
 * Generic PUT request
 */
const put = async (endpoint, body, options = {}) => {
  return makeRequest(endpoint, {
    method: 'PUT',
    body,
    ...options,
  });
};

/**
 * Generic PATCH request
 */
const patch = async (endpoint, body, options = {}) => {
  return makeRequest(endpoint, {
    method: 'PATCH',
    body,
    ...options,
  });
};

/**
 * Generic DELETE request
 */
const deleteRequest = async (endpoint, options = {}) => {
  return makeRequest(endpoint, {
    method: 'DELETE',
    ...options,
  });
};

/**
 * DOWNLOAD EMPLOYEE TEMPLATE - Fetch the template CSV
 */
const downloadEmployeeTemplate = async () => {
  return makeRequest('/employees/bulk/template', {
    method: 'GET',
    requiresAuth: true,
  });
};

/**
 * VALIDATE EMPLOYEE CSV - Send file to validate
 */
const validateEmployeeCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return makeRequest('/employees/bulk/validate', {
    method: 'POST',
    body: formData,
    requiresAuth: true,
  });
};

/**
 * IMPORT EMPLOYEES - Submit verified file for bulk insert
 */
const importEmployeeCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return makeRequest('/employees/bulk/import', {
    method: 'POST',
    body: formData,
    requiresAuth: true,
  });
};

export {
  APIError,
  makeRequest,
  refreshAccessToken,
  login,
  logout,
  getUserProfile,
  verifyToken,
  get,
  post,
  put,
  patch,
  deleteRequest,
  downloadEmployeeTemplate,
  validateEmployeeCSV,
  importEmployeeCSV,
};
