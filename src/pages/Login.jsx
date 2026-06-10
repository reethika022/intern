import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore((state) => ({
    login: state.login,
    isAuthenticated: state.isAuthenticated,
  }));

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      if (login(email, password, name)) {
        toast.success(`Welcome back, ${name || email}!`);
        navigate("/dashboard");
      } else {
        toast.error("Please fill in all fields");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pulse-bg to-pulse-card p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-pulse-border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-pulse-primary rounded-lg mb-4">
              <LogIn className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-pulse-text">BIOFACTOR PULSE</h1>
            <p className="text-pulse-muted mt-2">Agricultural Operations Management</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pulse-text mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-pulse-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pulse-primary bg-white text-pulse-text"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pulse-text mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-pulse-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pulse-primary bg-white text-pulse-text"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pulse-text mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-pulse-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pulse-primary bg-white text-pulse-text"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-pulse-primary hover:bg-emerald-600 text-white font-semibold rounded-lg transition"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-pulse-bg rounded-lg">
            <p className="text-xs font-semibold text-pulse-muted mb-2">Demo Credentials:</p>
            <p className="text-xs text-pulse-muted">Email: <span className="font-mono text-pulse-text">demo@biofactor.com</span></p>
            <p className="text-xs text-pulse-muted">Password: <span className="font-mono text-pulse-text">demo123</span></p>
            <p className="text-xs text-pulse-muted mt-2">💡 Use any email and password to login</p>
          </div>
        </div>
      </div>
    </div>
  );
}
