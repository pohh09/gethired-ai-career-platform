import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, Users, Briefcase, ChevronRight } from "lucide-react";
import Tags from "./Tags";
import type { Company } from "../../types/company";

export interface CompanyCardProps {
  company: Company;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export default function CompanyCard({ company, onTagClick, className = "" }: CompanyCardProps) {
  const navigate = useNavigate();

  const getWorkplaceBadge = (type: string) => {
    switch (type) {
      case "Remote":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40";
      case "Hybrid":
        return "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/40";
      default:
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/companies/${company._id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      tabIndex={0}
      role="button"
      aria-label={`View detail profile for ${company.name}`}
      onClick={() => navigate(`/companies/${company._id}`)}
      onKeyDown={handleKeyDown}
      className={`group p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className="h-11 w-11 rounded-xl object-contain border border-slate-200 dark:border-slate-800 p-1 bg-white shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                {company.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                {company.name}
              </h3>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate block">
                {company.industry}
              </span>
            </div>
          </div>

          <span
            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shrink-0 uppercase tracking-wider ${getWorkplaceBadge(
              company.workplaceType
            )}`}
          >
            {company.workplaceType}
          </span>
        </div>


        {company.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {company.description}
          </p>
        )}


        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 my-3">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{company.headquarters}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={13} className="text-slate-400 shrink-0" />
            <span>{company.size}</span>
          </div>

          {company.website && (
            <div className="flex items-center gap-2 pt-0.5">
              <ExternalLink size={13} className="text-indigo-500 shrink-0" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-indigo-600 dark:text-indigo-400 hover:underline truncate font-semibold"
              >
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>


        {company.tags && company.tags.length > 0 && (
          <div className="my-3" onClick={(e) => e.stopPropagation()}>
            <Tags tags={company.tags} size="sm" onTagClick={onTagClick} />
          </div>
        )}
      </div>


      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Briefcase size={13} className="text-slate-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100">{company.activeJobsCount}</span> active jobs
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <span>{company.lastActivity}</span>
          <ChevronRight size={13} />
        </div>
      </div>
    </motion.div>
  );
}
