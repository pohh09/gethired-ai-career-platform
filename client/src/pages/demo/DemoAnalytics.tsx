import { BarChart3, TrendingUp, Award, Target, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DemoAnalytics() {
  return (
    <div className="space-y-6 w-full pb-10">
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <BarChart3 size={22} className="text-indigo-600" />
            <span>Executive Career Analytics & Insights</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Application conversion funnels, interview pass rates, and salary progression analytics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Funnel Conversion Rate</span>
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100 block">19.0%</span>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp size={13} /> 8 interviews from 42 applications
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Offer Conversion Rate</span>
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100 block">25.0%</span>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <Award size={13} /> 2 offers from 8 interview pipelines
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Avg Time to First Response</span>
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100 block">4.2 Days</span>
          <p className="text-xs text-blue-600 font-bold flex items-center gap-1">
            <Clock size={13} /> 62% faster than tech industry median
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Target Role Benchmark</span>
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100 block">₹42L LPA</span>
          <p className="text-xs text-purple-600 font-bold flex items-center gap-1">
            <Target size={13} /> Top 5% Senior Full Stack Band
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            Application Pipeline Stage Distribution
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { stage: "Saved Target Roles", count: 3, percent: 15, color: "bg-slate-400" },
              { stage: "Applications Submitted", count: 4, percent: 20, color: "bg-blue-500" },
              { stage: "Active Interview Processes", count: 3, percent: 35, color: "bg-amber-500" },
              { stage: "Formal Job Offers", count: 2, percent: 20, color: "bg-emerald-500" },
              { stage: "Closed / Archived", count: 2, percent: 10, color: "bg-rose-400" },
            ].map((s) => (
              <div key={s.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{s.stage} ({s.count})</span>
                  <span className="text-slate-500">{s.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
            Unlock Full Analytics
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Sign up to track historical compensation growth trends, company response heatmaps, and automated interview feedback metrics.
          </p>
          <Link
            to="/register"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Create Free Account</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
