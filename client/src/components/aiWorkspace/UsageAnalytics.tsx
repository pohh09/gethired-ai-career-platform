import { motion } from "framer-motion";
import {
  BarChart3,
  Zap,
  TrendingUp,
  Award,
  PieChart as PieIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { AIUsageAnalyticsData } from "../../types/aiWorkspace";

interface UsageAnalyticsProps {
  analytics: AIUsageAnalyticsData;
}

export default function UsageAnalytics({ analytics }: UsageAnalyticsProps) {
  const metricCards = [
    {
      id: "total-requests",
      label: "Total AI Requests",
      value: analytics.totalRequests.toString(),
      subtext: "Lifetime AI generations",
      icon: Zap,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/40",
    },
    {
      id: "most-used",
      label: "Most Used Feature",
      value: analytics.mostUsedFeature,
      subtext: "42% of total activity",
      icon: BarChart3,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-800/40",
    },
    {
      id: "avg-resume",
      label: "Average Resume Score",
      value: `${analytics.avgResumeScore}/100`,
      subtext: "+8 pts improvement",
      icon: Award,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40",
    },
    {
      id: "avg-match",
      label: "Average Match Score",
      value: `${analytics.avgMatchScore}%`,
      subtext: "High alignment across target jobs",
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/40",
    },
  ];

  return (
    <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">

      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 size={18} className="text-indigo-500" />
          Usage Analytics & Insights
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track your AI utilization trends and score trajectories over time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className={`p-4 rounded-xl border ${card.bg} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {card.label}
                </span>
                <Icon size={18} className={card.color} />
              </div>
              <div className="mt-2">
                <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {card.value}
                </p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {card.subtext}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">

        <div className="lg:col-span-2 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Monthly AI Activity & Score Progress
            </h3>
            <span className="text-[11px] text-slate-400">Last 6 Months</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="requests" name="Requests" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="score" name="Avg Score" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <PieIcon size={14} className="text-indigo-500" />
              Tool Distribution
            </h3>
          </div>
          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {analytics.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>


          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            {analytics.categoryDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-[11px]">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 ml-auto">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
