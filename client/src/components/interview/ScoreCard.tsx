import type { InterviewReadinessMetrics } from "../../types/interview";

export interface ScoreCardProps {
  metrics: InterviewReadinessMetrics;
  className?: string;
}

export default function ScoreCard({ metrics, className = "" }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85)
      return "stroke-emerald-500 text-emerald-600 dark:text-emerald-400";
    if (score >= 70)
      return "stroke-indigo-500 text-indigo-600 dark:text-indigo-400";
    return "stroke-amber-500 text-amber-600 dark:text-amber-400";
  };

  const categories = [
    {
      label: "Technical Knowledge",
      score: metrics.knowledge,
      color: "bg-indigo-500",
    },
    {
      label: "Communication Clarity",
      score: metrics.communication,
      color: "bg-purple-500",
    },
    {
      label: "Problem Solving / Coding",
      score: metrics.technical,
      color: "bg-blue-500",
    },
    {
      label: "Behavioral Alignment",
      score: metrics.behavioral,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div
      className={`p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm space-y-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Interview Readiness Score
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {metrics.overall >= 85
              ? "High Candidate Readiness 🚀"
              : metrics.overall >= 70
                ? "Solid Preparation Level 📈"
                : "Further Revision Recommended ⚠️"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Based on role keyword requirements, domain depth, and answer
            structure.
          </p>
        </div>

        <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="3.5"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`transition-all duration-1000 ${getScoreColor(metrics.overall)}`}
              strokeDasharray={`${metrics.overall}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold tracking-tight">
              {metrics.overall}%
            </span>
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
              Ready
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        {categories.map((cat) => (
          <div key={cat.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{cat.label}</span>
              <span className="font-mono text-slate-500">{cat.score}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${cat.score}%` }}
                className={`h-full ${cat.color} rounded-full transition-all duration-500`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
