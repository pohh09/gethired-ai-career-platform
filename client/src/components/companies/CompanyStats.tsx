import { Briefcase, Users, MessageSquare, TrendingUp } from "lucide-react";
import type { Company } from "../../types/company";

export interface CompanyStatsProps {
  company: Company;
  className?: string;
}

export default function CompanyStats({
  company,
  className = "",
}: CompanyStatsProps) {
  const recruiterCount = company.recruiters?.length || 0;
  const logCount = company.logs?.length || 0;
  const applicationCount =
    company.applications?.length || company.totalApplications || 0;

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}>
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Active Applications
          </span>
          <Briefcase size={16} className="text-blue-500" />
        </div>
        <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {applicationCount}
        </span>
        <span className="block text-[11px] text-slate-400 mt-0.5">
          {company.activeJobsCount} active roles
        </span>
      </div>

      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Recruiter Contacts
          </span>
          <Users size={16} className="text-purple-500" />
        </div>
        <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {recruiterCount}
        </span>
        <span className="block text-[11px] text-slate-400 mt-0.5">
          Stored relationships
        </span>
      </div>

      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Interactions Logged
          </span>
          <MessageSquare size={16} className="text-indigo-500" />
        </div>
        <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {logCount}
        </span>
        <span className="block text-[11px] text-slate-400 mt-0.5">
          Calls, emails & meetings
        </span>
      </div>

      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Conversion Potential
          </span>
          <TrendingUp size={16} className="text-emerald-500" />
        </div>
        <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {recruiterCount > 0 && logCount > 1
            ? "High"
            : recruiterCount > 0
              ? "Medium"
              : "Initial"}
        </span>
        <span className="block text-[11px] text-slate-400 mt-0.5">
          Based on CRM touchpoints
        </span>
      </div>
    </div>
  );
}
