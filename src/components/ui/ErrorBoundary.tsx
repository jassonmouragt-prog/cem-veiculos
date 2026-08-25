import { Component, ReactNode, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Erro inesperado</h1>
            <p className="text-sm text-gray-400 mb-6">
              Ocorreu um erro ao carregar esta página. Nossa equipe foi notificada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleRetry} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </Button>
              <Link to="/admin">
                <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5">
                  <Home className="w-4 h-4" />
                  Ir para Dashboard
                </Button>
              </Link>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left text-xs text-gray-500 bg-[#121212] p-3 rounded-lg">
                <summary className="cursor-pointer mb-2">Detalhes do erro (dev)</summary>
                <pre className="whitespace-pre-wrap overflow-auto max-h-60">{this.state.error.stack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}