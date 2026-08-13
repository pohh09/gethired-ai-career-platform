import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";
import Button from "../ui/Button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/";
  };

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <div className="max-w-md w-full text-center p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl space-y-6">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
              <AlertOctagon size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Something went wrong
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                An unexpected application error occurred. Click below to retry
                or return to dashboard.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 text-left rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-mono text-rose-600 dark:text-rose-400 overflow-x-auto max-h-32 border border-rose-200/50 dark:border-rose-900/50">
                {this.state.error.message}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={this.handleReload}
                variant="outline"
                leftIcon={<RefreshCw size={15} />}
              >
                Reload
              </Button>

              <Button
                onClick={this.handleReset}
                variant="primary"
                leftIcon={<Home size={15} />}
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
