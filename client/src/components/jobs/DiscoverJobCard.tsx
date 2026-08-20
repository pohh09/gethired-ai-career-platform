import { motion } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Bookmark,
  Eye,
  Check,
} from "lucide-react";
import Button from "../ui/Button";
import JobAiActionsMenu from "./JobAiActionsMenu";
import type { DiscoverJob } from "../../types/job";

export interface DiscoverJobCardProps {
  job: DiscoverJob;
  isSaved?: boolean;
  onViewDetails: (job: DiscoverJob) => void;
  onSaveJob: (job: DiscoverJob) => void;
}

const PROVIDER_STYLES: Record<string, string> = {
  Adzuna: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60",
  Jooble: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60",
  JSearch: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/60",
  RemoteOK: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60",
  Remotive: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/60",
  Greenhouse: "bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-200/60 dark:border-green-800/60",
  Lever: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/60",
  USAJobs: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/60",
  Arbeitnow: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60",
  RapidJobs: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60",
};

export default function DiscoverJobCard({
  job,
  isSaved = false,
  onViewDetails,
  onSaveJob,
}: DiscoverJobCardProps) {
  const provider = job.provider || "JSearch";
  const badgeStyle = PROVIDER_STYLES[provider] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs flex flex-col justify-between space-y-3.5 sm:space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all select-none"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-800 shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const domain =
                    job.company.toLowerCase().replace(/[^a-z0-9]/g, "") +
                    ".com";
                  if (!target.dataset.triedFavicon) {
                    target.dataset.triedFavicon = "true";
                    target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                  } else {
                    target.onerror = null;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=0284c7&color=fff&bold=true&font-size=0.45`;
                  }
                }}
              />
            ) : (
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-sm sm:text-base shadow-xs shrink-0 ring-2 ring-indigo-500/10">
                {job.company.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 block truncate">
                {job.company}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">
                {job.role}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold rounded-full border ${badgeStyle}`}
            >
              {provider}
            </span>
            <a
              href={job.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
              title="Open original job posting"
            >
              <ExternalLink size={15} />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs font-semibold">
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
            {job.workplaceType}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
            {job.employmentType}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {job.experienceLevel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate font-medium">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate justify-end">
            <DollarSign size={13} className="text-slate-400 shrink-0" />
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
              {job.salaryText ||
                (job.salary
                  ? `$${job.salary.toLocaleString()}/yr`
                  : "Competitive")}
            </span>
          </div>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-0.5">
          {job.description}
        </p>

        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {job.skills.slice(0, 4).map((sk) => (
              <span
                key={sk}
                className="px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700"
              >
                {sk}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold self-center">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2.5 sm:space-y-3 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            Posted {job.postedDate}
          </span>
          <span className="font-mono font-bold text-indigo-500">
            Live Opportunity
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(job)}
            leftIcon={<Eye size={13} />}
            className="text-[11px] sm:text-xs font-bold px-1 sm:px-1.5"
          >
            Details
          </Button>

          <Button
            variant={isSaved ? "secondary" : "primary"}
            size="sm"
            onClick={() => onSaveJob(job)}
            leftIcon={isSaved ? <Check size={13} /> : <Bookmark size={13} />}
            className={`text-[11px] sm:text-xs font-bold px-1 sm:px-1.5 ${isSaved ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200" : ""}`}
          >
            {isSaved ? "Tracked" : "Track"}
          </Button>

          <JobAiActionsMenu job={job} variant="button" />
        </div>
      </div>
    </motion.div>
  );
}
