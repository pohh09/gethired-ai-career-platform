import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart2 } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { useUIStore } from "../../store/uiStore";

export type TimeframeMode = "30d" | "90d" | "6m";

export interface PerformanceChartProps {
  monthlyData?: Array<{ month: string; count: number }>;
  isLoading?: boolean;
  className?: string;
}

export default function PerformanceChart({
  monthlyData,
  isLoading = false,
  className = "",
}: PerformanceChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeMode>("6m");
  const { theme } = useUIStore();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const chartData = useMemo(() => {
    const defaultData =
      monthlyData && monthlyData.length > 0
        ? monthlyData
        : [
            { month: "Mar", count: 5 },
            { month: "Apr", count: 9 },
            { month: "May", count: 12 },
            { month: "Jun", count: 15 },
            { month: "Jul", count: 18 },
            { month: "Aug", count: 14 },
          ];

    switch (timeframe) {
      case "30d":
        return [
          { month: "Week 1", count: 3 },
          { month: "Week 2", count: 5 },
          { month: "Week 3", count: 4 },
          { month: "Week 4", count: 6 },
        ];
      case "90d":
        return defaultData.slice(-3);
      case "6m":
      default:
        return defaultData.slice(-6);
    }
  }, [monthlyData, timeframe]);

  const timeframeLabels: Record<TimeframeMode, string> = {
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "6m": "Last 6 Months",
  };

  const hasData = chartData.some((d) => d.count > 0);

  return (
    <div className={`space-y-4 ${className}`}>
      <SectionTitle
        title="Monthly Performance"
        subtitle="Applications submitted over time"
        action={
          <div
            className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80"
            role="group"
            aria-label="Timeframe toggle"
          >
            {(["30d", "90d", "6m"] as TimeframeMode[]).map((tf) => {
              const isSelected = timeframe === tf;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-extrabold"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                  aria-pressed={isSelected}
                >
                  {timeframeLabels[tf]}
                </button>
              );
            })}
          </div>
        }
      />

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm">
        {isLoading ? (
          <div className="h-[260px] w-full bg-slate-100 dark:bg-slate-800/60 animate-pulse rounded-xl" />
        ) : !hasData ? (
          <div className="h-[260px] flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center border border-indigo-200/50">
              <BarChart2 size={24} />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              No performance data yet.
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Application activity graph will populate automatically as you add
              job applications.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorApplications"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? "#1e293b" : "#f1f5f9"}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0f172a" : "#ffffff",
                  borderColor: isDark ? "#334155" : "#e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  color: isDark ? "#f8fafc" : "#0f172a",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorApplications)"
                dot={{
                  r: 4,
                  fill: "#6366f1",
                  strokeWidth: 2,
                  stroke: "#ffffff",
                }}
                activeDot={{ r: 7, fill: "#6366f1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
