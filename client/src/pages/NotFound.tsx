import { Link } from "react-router-dom";
import { Home, Compass } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        <div className="relative mx-auto h-24 w-24 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-100 dark:border-blue-900/50">
          <Compass size={48} className="animate-spin-slow" />
          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-xs shadow-xs">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link to="/" className="inline-block w-full">
          <Button variant="primary" fullWidth leftIcon={<Home size={18} />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
