import { useNavigate } from "react-router-dom";
import { ExternalLink, MapPin, ChevronRight } from "lucide-react";
import Tags from "./Tags";
import type { Company } from "../../types/company";

export interface CompanyTableProps {
  companies?: Company[];
  onTagClick?: (tag: string) => void;
  className?: string;
}

export default function CompanyTable({
  companies = [],
  onTagClick,
  className = "",
}: CompanyTableProps) {
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent, companyId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/companies/${companyId}`);
    }
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table
        className="w-full text-left border-collapse text-xs"
        role="table"
        aria-label="Companies directory table"
      >
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
            <th className="py-3.5 px-4 rounded-tl-xl">Company</th>
            <th className="py-3.5 px-4">Industry</th>
            <th className="py-3.5 px-4">Headquarters</th>
            <th className="py-3.5 px-4">Workplace Model</th>
            <th className="py-3.5 px-4">Active Jobs</th>
            <th className="py-3.5 px-4">Tags</th>
            <th className="py-3.5 px-4 text-right rounded-tr-xl">
              Last Activity
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {companies.map((comp) => (
            <tr
              key={comp._id}
              tabIndex={0}
              role="button"
              aria-label={`View ${comp.name}`}
              onClick={() => navigate(`/companies/${comp._id}`)}
              onKeyDown={(e) => handleKeyDown(e, comp._id)}
              className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-colors cursor-pointer focus:outline-none focus:bg-indigo-50/60 dark:focus:bg-slate-800/70"
            >
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  {comp.logoUrl ? (
                    <img
                      src={comp.logoUrl}
                      alt={`${comp.name} logo`}
                      className="h-8 w-8 rounded-lg object-contain border border-slate-200 dark:border-slate-800 p-0.5 bg-white shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs shrink-0">
                      {comp.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <span>{comp.name}</span>
                      {comp.website && (
                        <a
                          href={comp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-indigo-500 transition-colors"
                          title={`Visit ${comp.name} website`}
                          aria-label={`Visit ${comp.name} website`}
                        >
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {comp.size}
                    </span>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                {comp.industry}
              </td>

              <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate max-w-[140px]">
                    {comp.headquarters}
                  </span>
                </div>
              </td>

              <td className="py-3.5 px-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50">
                  {comp.workplaceType}
                </span>
              </td>

              <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                {comp.activeJobsCount}
              </td>

              <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                <Tags
                  tags={comp.tags.slice(0, 3)}
                  size="sm"
                  onTagClick={onTagClick}
                />
              </td>

              <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400">
                <div className="inline-flex items-center gap-1">
                  <span>{comp.lastActivity}</span>
                  <ChevronRight
                    size={12}
                    className="text-slate-300 dark:text-slate-600"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
