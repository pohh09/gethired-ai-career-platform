import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Target,
  Award,
  HeartPulse,
  TrendingUp,
} from "lucide-react";
import type { AIQuickStatsData } from "../../types/aiWorkspace";

interface QuickStatsProps {
  stats: AIQuickStatsData;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    {
      id: "analyses",
      label: "AI Analyses Performed",
      value: stats.analysesPerformed.toString(),
      subtext: "+14% this month",
      icon: Sparkles,
      gradient: "from-indigo-500 to-purple-600",
      lightBg:
        "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/40",
      textColor: "text-indigo-600 dark:text-indigo-400",
      progress: null,
    },
    {
      id: "resume-score",
      label: "Resume Score",
      value: `${stats.resumeScore}/100`,
      subtext: "Top 12% candidate",
      icon: FileText,
      gradient: "from-emerald-500 to-teal-600",
      lightBg:
        "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40",
      textColor: "text-emerald-600 dark:text-emerald-400",
      progress: stats.resumeScore,
    },
    {
      id: "match-score",
      label: "Job Match Score",
      value: `${stats.jobMatchScore}%`,
      subtext: "Avg. across saved jobs",
      icon: Target,
      gradient: "from-blue-500 to-cyan-600",
      lightBg:
        "bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/40",
      textColor: "text-blue-600 dark:text-blue-400",
      progress: stats.jobMatchScore,
    },
    {
      id: "interview-readiness",
      label: "Interview Readiness",
      value: `${stats.interviewReadiness}%`,
      subtext: "Interview mode active",
      icon: Award,
      gradient: "from-amber-500 to-orange-600",
      lightBg:
        "bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/40",
      textColor: "text-amber-600 dark:text-amber-400",
      progress: stats.interviewReadiness,
    },
    {
      id: "career-health",
      label: "Career Health Score",
      value: `${stats.careerHealthScore}/100`,
      subtext: "Excellent trajectory",
      icon: HeartPulse,
      gradient: "from-rose-500 to-pink-600",
      lightBg:
        "bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/40",
      textColor: "text-rose-600 dark:text-rose-400",
      progress: stats.careerHealthScore,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <TrendingUp size={16} className="text-indigo-500" />
          Quick Performance Stats
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className={`p-4 rounded-2xl border ${item.lightBg} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-xs group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon size={18} />
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                {item.progress !== null && (
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full bg-gradient-to-r ${item.gradient}`}
                    />
                  </div>
                )}
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span>{item.subtext}</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
