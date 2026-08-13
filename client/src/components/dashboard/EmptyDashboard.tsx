import { Rocket, Plus } from "lucide-react";
import Button from "../ui/Button";

export interface EmptyDashboardProps {
  onAddFirstApplication: () => void;
  className?: string;
}

export default function EmptyDashboard({
  onAddFirstApplication,
  className = "",
}: EmptyDashboardProps) {
  return (
    <div
      className={`p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-6 max-w-2xl mx-auto my-8 ${className}`}
    >
      <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <Rocket size={40} />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Start Tracking Your Job Applications
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Welcome to GetHired AI! Add your target companies and job submissions
          to unlock your command center metrics, hiring conversion funnel, and
          AI insights.
        </p>
      </div>

      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={onAddFirstApplication}
          leftIcon={<Plus size={18} />}
        >
          Add Your First Application
        </Button>
      </div>
    </div>
  );
}
