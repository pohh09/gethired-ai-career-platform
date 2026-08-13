interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

export default function ProgressBar({
  current,
  total,
  label,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((current / (total || 1)) * 100)),
  );

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span>{label || `Progress: ${current} of ${total}`}</span>
        <span className="font-mono">{percentage}%</span>
      </div>

      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div
          style={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
        />
      </div>
    </div>
  );
}
