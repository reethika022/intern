/**
 * Login Page Component
 * Handles user authentication with validation, error handling, and loading states.
 * Redirects authenticated users to /dashboard immediately.
 * Redirects to /dashboard on successful login.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Eye, EyeOff, ClipboardCheck, Users, MapPinned, Store, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { validateLoginForm, sanitizeInput } from '../lib/validations';

export function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authLoading = useAuthStore((state) => state.isLoading);

  // Redirect already-authenticated users away from the login page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleAutofill = () => {
    if (isBusy) return;
    setFormData({ email: 'demo@biofactor.com', password: 'demo123' });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.email;
      delete next.password;
      return next;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
    // Clear field-level error as the user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation before hitting the network
    const validation = validateLoginForm(formData.email, formData.password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success(`Welcome back, ${result.user?.name || 'User'}!`);
        navigate('/dashboard', { replace: true });
      } else {
        const msg = result.error || 'Login failed. Please try again.';
        toast.error(msg);
        setErrors({ form: msg });
      }
    } catch (error) {
      const msg = error.message || 'An unexpected error occurred.';
      toast.error(msg);
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || authLoading;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 font-sans text-pulse-text antialiased">
      
      {/* Left Column: Premium Brand & Features (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 text-white relative overflow-hidden">
        
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        {/* Glow effect */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-lime-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center">
            <LogIn className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-emerald-400">BIOFACTOR</span>
            <span className="text-white font-light text-lg tracking-wider ml-1">PULSE</span>
          </div>
        </div>

        {/* Center Features */}
        <div className="my-auto relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles className="h-3 w-3" />
            Empowering Smart Agriculture
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Seamless Management of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">
              Field & Crop Operations
            </span>
          </h2>
          <p className="text-emerald-200/80 mt-4 text-base leading-relaxed">
            Welcome to the centralized dashboard for interns, dealers, and field officers. Track operations, coordinate distribution, and record territory activities with real-time accuracy.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4 mt-12 w-full">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner transition hover:bg-white/10">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <ClipboardCheck className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-white text-sm">GPS Attendance</h3>
              <p className="text-xs text-emerald-200/70 mt-1">Territory-locked selfie check-in/out verification.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner transition hover:bg-white/10">
              <div className="h-8 w-8 rounded-lg bg-lime-500/20 text-lime-400 flex items-center justify-center mb-3">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-white text-sm">Farmer Onboarding</h3>
              <p className="text-xs text-emerald-200/70 mt-1">Fast bulk onboarding and regional registration.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner transition hover:bg-white/10">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <MapPinned className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-white text-sm">Demo Tracking</h3>
              <p className="text-xs text-emerald-200/70 mt-1">Multi-stage crop testing, soil parameters & logs.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner transition hover:bg-white/10">
              <div className="h-8 w-8 rounded-lg bg-lime-500/20 text-lime-400 flex items-center justify-center mb-3">
                <Store className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-white text-sm">Dealers Directory</h3>
              <p className="text-xs text-emerald-200/70 mt-1">Verify visits and transaction records in real-time.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-emerald-300/50 relative z-10">
          © {new Date().getFullYear()} Biofactor Pulse. All rights reserved.
        </p>
      </div>

      {/* Right Column: Sleek Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 md:p-20 bg-slate-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-white border border-slate-200/80 shadow-2xl rounded-2xl p-8 sm:p-10 relative z-10 transition-all">
          
          {/* Header (Shows branding on mobile only) */}
          <div className="text-center mb-8">
            <div className="inline-flex lg:hidden items-center gap-2 mb-4 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
              <div className="h-5 w-5 bg-pulse-primary rounded-md flex items-center justify-center">
                <LogIn className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-xs tracking-wider text-pulse-text">BIOFACTOR PULSE</span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 lg:text-3xl">Welcome Back</h1>
            <p className="text-slate-500 mt-2 text-sm">Please sign in to access your operations dashboard</p>
          </div>

          {/* Form-level error alert */}
          {errors.form && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-rose-700 leading-normal">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@company.com"
                disabled={isBusy}
                autoComplete="email"
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50 text-slate-800 placeholder-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.email ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-200'
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-xs font-medium text-rose-600 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={isBusy}
                  autoComplete="current-password"
                  className={`w-full px-4 py-2.5 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50 text-slate-800 placeholder-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-200'
                  }`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {/* Show / hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isBusy}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs font-medium text-rose-600 mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isBusy}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isBusy ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>

          {/* Premium Demo credentials info box */}
          <div className="mt-8 p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100/60 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100/15 rounded-full pointer-events-none" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-extrabold text-emerald-800 tracking-wider uppercase">Demo Credentials</span>
              <button
                type="button"
                onClick={handleAutofill}
                disabled={isBusy}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 disabled:opacity-50 active:scale-95 transition-all flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 border border-emerald-200/50 rounded-lg shadow-sm"
              >
                Autofill Credentials
              </button>
            </div>
            
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-600 flex justify-between">
                <span>Email:</span>
                <span className="font-mono font-semibold text-slate-800">demo@biofactor.com</span>
              </p>
              <p className="text-slate-600 flex justify-between">
                <span>Password:</span>
                <span className="font-mono font-semibold text-slate-800">demo123</span>
              </p>
            </div>
            
            <div className="mt-3.5 pt-3 border-t border-emerald-100/50 text-[10px] text-slate-500 leading-normal">
              💡 <span className="font-semibold">Demo Mode:</span> You can also log in with any valid format email &amp; 6+ character password.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
