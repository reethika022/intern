import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pulse-bg to-pulse-card p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-pulse-border text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-2">⚠️ Something went wrong</h1>
              <p className="text-pulse-muted mb-4">{this.state.error?.message}</p>
              <button
                onClick={() => window.location.href = "/"}
                className="px-4 py-2 bg-pulse-primary text-white rounded-lg hover:bg-emerald-600 transition"
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
