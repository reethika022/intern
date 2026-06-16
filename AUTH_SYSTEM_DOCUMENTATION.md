# Authentication System Documentation

## Overview

This is a production-ready authentication system with JWT token management, secure token storage, automatic token refresh, and comprehensive error handling.

## Architecture

### Files Structure

```
src/
├── utils/
│   └── tokenManager.js          # JWT token storage and validation
├── lib/
│   ├── api.js                   # API service layer with token management
│   └── validations.js           # Input validation utilities
├── store/
│   └── authStore.js             # Zustand authentication store
├── pages/
│   └── Login.jsx                # Login page with validation and error handling
├── components/
│   ├── common/
│   │   └── ProtectedRoute.jsx   # Protected route wrapper
│   └── layout/
│       └── Navbar.jsx           # Navigation with logout
├── App.jsx                      # Main router with auth routes
└── .env                         # Environment variables (git-ignored)
```

## Components and Their Responsibilities

### 1. Token Manager (`src/utils/tokenManager.js`)

Handles secure JWT token management with the following functions:

- **`getAccessToken()`** - Retrieve access token from localStorage
- **`getRefreshToken()`** - Retrieve refresh token from localStorage
- **`setTokens(accessToken, refreshToken)`** - Store tokens securely
- **`getUser()`** - Get stored user data
- **`setUser(user)`** - Store user data
- **`clearTokens()`** - Clear all authentication data on logout
- **`isAuthenticated()`** - Check if user is authenticated
- **`isTokenExpired(token)`** - Check if token has expired
- **`getAuthHeader()`** - Get Bearer token for API requests
- **`decodeToken(token)`** - Decode JWT payload (client-side only)

### 2. API Service (`src/lib/api.js`)

Handles all HTTP requests with automatic token management:

- **`makeRequest(endpoint, options)`** - Base request handler with token refresh logic
- **`login(email, password)`** - Authenticate user
- **`logout()`** - Logout and invalidate session
- **`getUserProfile()`** - Fetch current user info
- **`verifyToken()`** - Verify token validity
- Generic methods: `get()`, `post()`, `put()`, `patch()`, `deleteRequest()`

**Key Features:**
- Automatic token refresh on 401 responses
- Retry logic for failed token refresh
- Consistent error handling with APIError class
- Automatic redirect to login on permanent auth failures

### 3. Validation Utilities (`src/lib/validations.js`)

Provides input validation and sanitization:

- **`validateEmail(email)`** - Email format validation
- **`validatePassword(password)`** - Password strength validation
- **`validateName(name)`** - Name field validation
- **`validateLoginForm(email, password, name)`** - Complete form validation
- **`sanitizeInput(input)`** - XSS prevention by sanitizing user input

### 4. Authentication Store (`src/store/authStore.js`)

Zustand store managing authentication state:

```javascript
{
  user,                    // Current user object
  isAuthenticated,         // Boolean flag
  isLoading,              // Loading state for API calls
  error,                  // Error message

  // Methods
  login(email, password)   // Authenticate and store tokens
  logout()                 // Logout and clear data
  checkAuthStatus()        // Verify auth status
  setError(error)         // Set error message
  clearError()            // Clear error
  updateUser(userData)    // Update user profile
}
```

### 5. Login Page (`src/pages/Login.jsx`)

Features:
- Form validation with detailed error messages
- Show/hide password toggle
- Loading states during submission
- Accessible form inputs with ARIA labels
- Responsive design
- Demo credentials display
- Error boundary integration

### 6. Protected Route (`src/components/common/ProtectedRoute.jsx`)

- Checks authentication status
- Shows loading state while verifying
- Redirects unauthenticated users to /login
- Wraps protected pages

### 7. Navbar (`src/components/layout/Navbar.jsx`)

Features:
- Display current user info
- Logout with confirmation
- Loading state during logout
- User role badge
- Profile and settings navigation
- Notifications and settings icons

### 8. Router (`src/App.jsx`)

Route structure:
```
/login          → Login page (public)
/              → Dashboard (protected)
/attendance    → Attendance page (protected)
/tasks         → Tasks page (protected)
/farmers       → Farmers page (protected)
... (other protected routes)
```

## Authentication Flow

### Login Flow

```
1. User enters email, password, name
2. Login page validates input
3. API call to /auth/login
4. Backend returns: user object + accessToken + refreshToken
5. Tokens stored in localStorage
6. User object stored in localStorage
7. Auth store updated
8. User redirected to /dashboard
```

### Protected Route Access

```
1. User navigates to protected route
2. ProtectedRoute checks isAuthenticated
3. If not authenticated → redirect to /login
4. If authenticated → show page with loading state
5. Page renders normally
```

### Logout Flow

```
1. User clicks logout in navbar
2. Confirmation dialog shows
3. API call to /auth/logout (optional)
4. All tokens cleared from localStorage
5. Auth store reset
6. User redirected to /login
```

### Token Refresh Flow

```
1. API request is made with access token
2. Backend returns 401 (token expired)
3. API service calls /auth/refresh
4. Backend returns new accessToken
5. New token stored
6. Original request retried with new token
7. If refresh fails → redirect to login
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Token Configuration
VITE_TOKEN_STORAGE_KEY=biofactor_auth_token
VITE_REFRESH_TOKEN_STORAGE_KEY=biofactor_refresh_token
VITE_USER_STORAGE_KEY=biofactor_user

# Token Expiration (in minutes)
VITE_TOKEN_EXPIRY_CHECK_INTERVAL=5
```

## Security Features

### ✅ Implemented

1. **JWT Token Storage**
   - Stored in localStorage (accessible from browser for SPA needs)
   - Includes 60-second expiration buffer

2. **Input Validation**
   - Email format validation
   - Password strength requirements
   - Name field validation
   - XSS prevention via sanitization

3. **Token Expiration Handling**
   - Automatic expiration check
   - Automatic token refresh
   - Automatic logout on permanent failures

4. **Error Handling**
   - Detailed error messages
   - User-friendly error display
   - Consistent error object structure

5. **Session Persistence**
   - Tokens and user data persist after refresh
   - Automatic auth check on app initialization

### ⚠️ Additional Recommendations for Production

1. **Use HttpOnly Cookies**
   - Store refresh tokens in httpOnly cookies
   - Prevent XSS attacks from stealing tokens
   - Server-only access to sensitive cookies

2. **HTTPS Only**
   - Enable Secure flag on cookies
   - Encrypt token transmission

3. **CORS Configuration**
   - Restrict CORS to trusted domains
   - Use credentials in requests

4. **Backend Security**
   - Validate tokens on every request
   - Implement rate limiting
   - Use strong secret for token signing
   - Implement token blacklisting for logout

5. **Additional Headers**
   - Implement CSP (Content Security Policy)
   - Add X-Frame-Options
   - Add X-Content-Type-Options

## Integration Guide

### Step 1: Install Dependencies (Already Done)

```bash
npm install zustand react-router-dom sonner lucide-react react-hook-form
```

Your package.json already has all required dependencies.

### Step 2: Set Environment Variables

Create `.env` file with your API endpoint:

```env
VITE_API_BASE_URL=http://your-backend.com/api
```

### Step 3: Update Backend Login Endpoint

Your backend should implement `/api/auth/login` that:

```javascript
// Request
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

// Response (200 OK)
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "Admin"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Error Response (401 Unauthorized)
{
  "message": "Invalid credentials"
}
```

### Step 4: Implement Token Refresh Endpoint

Your backend should implement `/api/auth/refresh`:

```javascript
// Request
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Response (200 OK)
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..." // Optional
}

// Error Response (401 Unauthorized)
{
  "message": "Refresh token invalid or expired"
}
```

### Step 5: Implement Logout Endpoint

Your backend should implement `/api/auth/logout`:

```javascript
// Request
POST /api/auth/logout
Authorization: Bearer <accessToken>

// Response (200 OK)
{
  "message": "Logged out successfully"
}
```

### Step 6: Implement Token Verification Endpoint

Your backend should implement `/api/auth/verify`:

```javascript
// Request
POST /api/auth/verify
Authorization: Bearer <accessToken>

// Response (200 OK)
{
  "valid": true,
  "user": { /* user data */ }
}
```

### Step 7: Start Development Server

```bash
npm run dev
```

The app will:
1. Start at http://localhost:5173
2. Redirect to /login if not authenticated
3. Use mock data if backend is not available initially

## Testing the Authentication System

### Test 1: Login
1. Go to http://localhost:5173/login
2. Enter any valid email and password
3. Click Login
4. Should redirect to dashboard

### Test 2: Protected Routes
1. Go to http://localhost:5173/dashboard (without logging in)
2. Should redirect to /login

### Test 3: Page Refresh
1. Login and go to dashboard
2. Refresh the page (F5)
3. Should remain logged in

### Test 4: Logout
1. Click user menu in navbar
2. Click Logout
3. Should redirect to login
4. Should not be able to access dashboard

### Test 5: Form Validation
1. Go to login page
2. Try submitting empty form
3. Should show error messages
4. Try invalid email format
5. Should show email validation error

### Test 6: Token Expiration (Requires Backend)
1. Set token expiration to 1 minute
2. Login and wait for token to expire
3. Make API request
4. System should automatically refresh token
5. Request should succeed

## Common Issues and Solutions

### Issue: "Cannot POST /api/auth/login"
**Solution:** Ensure your backend is running and API_BASE_URL is correct in .env

### Issue: Infinite redirect loop to login
**Solution:** Check if login API is properly storing tokens in response. Verify token format matches expectations.

### Issue: Logout button not working
**Solution:** Check browser console for errors. Ensure API /auth/logout endpoint exists or remove the API call if not needed.

### Issue: Token not persisting after page refresh
**Solution:** Verify localStorage is not disabled. Check that tokens are being properly stored by API response.

### Issue: User redirected to login unexpectedly
**Solution:** Check if token has expired. Check browser storage to see if tokens are present. Check API response format matches expected structure.

## File Structure for Reference

```
frontend/
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── src/
│   ├── App.jsx                  # Main router
│   ├── main.jsx                 # Entry point
│   ├── index.css                # Global styles
│   ├── utils/
│   │   └── tokenManager.js      # Token management
│   ├── lib/
│   │   ├── api.js              # API service
│   │   ├── utils.js            # Existing utilities
│   │   └── validations.js       # Input validation
│   ├── store/
│   │   ├── authStore.js        # Auth state management
│   │   └── uiStore.js          # UI state management
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── Dashboard.jsx        # Dashboard
│   │   └── ... (other pages)
│   ├── components/
│   │   ├── common/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── ... (other components)
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   └── ui/
│   │       └── ... (UI components)
│   └── data/
│       └── mockData.js
└── index.html
```

## API Integration Checklist

- [ ] Backend implements /api/auth/login endpoint
- [ ] Backend implements /api/auth/refresh endpoint
- [ ] Backend implements /api/auth/logout endpoint
- [ ] Backend implements /api/auth/verify endpoint (optional)
- [ ] Backend returns correct JWT token format
- [ ] Backend validates tokens on every request
- [ ] Backend implements rate limiting on login endpoint
- [ ] Backend uses HTTPS in production
- [ ] CORS is properly configured
- [ ] Error responses follow consistent format
- [ ] Tokens include exp (expiration) claim
- [ ] API returns user data on login

## Performance Considerations

1. **Token Refresh Timing**
   - Tokens refresh automatically before expiration
   - 60-second buffer prevents edge case failures

2. **API Caching**
   - User data is cached in localStorage
   - Reduces unnecessary API calls

3. **Loading States**
   - Shows loading indicators during auth operations
   - Prevents duplicate submissions

4. **Error Recovery**
   - Automatic retry for failed token refresh
   - Graceful fallback to login on failures

## Maintenance and Updates

### Regular Tasks

1. **Monitor Token Expiration**
   - Review token expiration times
   - Adjust buffer time if needed

2. **Security Updates**
   - Keep dependencies updated
   - Review security best practices
   - Monitor for CVEs in dependencies

3. **Error Tracking**
   - Monitor auth-related errors in production
   - Fix issues as they arise

### Dependency Updates

```bash
# Check for updates
npm outdated

# Update packages
npm update

# For major updates, manually update and test
npm install package@latest
```

## Support and Debugging

### Enable Debug Logging

Add to `src/lib/api.js`:

```javascript
const DEBUG = true; // Set to false in production

const makeRequest = async (...) => {
  if (DEBUG) console.log('API Request:', endpoint, options);
  // ... rest of code
};
```

### Check localStorage

In browser console:

```javascript
// View stored tokens
console.log(localStorage.getItem('biofactor_auth_token'));
console.log(localStorage.getItem('biofactor_user'));

// Clear all auth data
localStorage.removeItem('biofactor_auth_token');
localStorage.removeItem('biofactor_refresh_token');
localStorage.removeItem('biofactor_user');
```

### Monitor Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Perform login
4. Check API responses and headers
5. Verify tokens are in responses

## Conclusion

This authentication system provides a solid foundation for your application with:

✅ Secure JWT token management
✅ Automatic token refresh
✅ Form validation and error handling
✅ Protected routes
✅ User persistence
✅ Clean code architecture
✅ Comprehensive error handling
✅ Production-ready security practices

For questions or issues, refer to the comments in the source code for detailed explanations.
