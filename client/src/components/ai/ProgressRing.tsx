import { motion } from "framer-motion";

export interface ProgressRingProps {
  score: number; // 0 to 100
  size?: number; // width/height in px
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressRing({
  score,
  size = 84,
  strokeWidth = 7,
  className = "",
  showLabel = true,
}: ProgressRingProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return { stroke: "#10b981", text: "text-emerald-600 dark:text-emerald-400" };
    if (s >= 70) return { stroke: "#6366f1", text: "text-indigo-600 dark:text-indigo-400" };
    if (s >= 50) return { stroke: "#f59e0b", text: "text-amber-600 dark:text-amber-400" };
    return { stroke: "#ef4444", text: "text-rose-600 dark:text-rose-400" };
  };

  const color = getColor(normalizedScore);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-slate-100 dark:stroke-slate-800"
          fill="transparent"
        />


        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color.stroke}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-xl font-extrabold tracking-tight ${color.text}`}>
            {normalizedScore}
          </span>
          <span className="text-[9px] font-bold uppercase text-slate-400 dark:text-slate-500 -mt-1">
            /100
          </span>
        </div>
      )}
    </div>
  );
}
