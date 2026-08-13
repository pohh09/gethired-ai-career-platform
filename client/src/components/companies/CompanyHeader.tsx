import { ExternalLink, MapPin, UserPlus, MessageSquare, Plus, Edit2 } from "lucide-react";
import Button from "../ui/Button";
import Tags from "./Tags";
import type { Company } from "../../types/company";

export interface CompanyHeaderProps {
  company: Company;
  onAddRecruiter?: () => void;
  onLogInteraction?: () => void;
  onAddNote?: () => void;
  onEditCompany?: () => void;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export default function CompanyHeader({
  company,
  onAddRecruiter,
  onLogInteraction,
  onAddNote,
  onEditCompany,
  onTagClick,
  className = "",
}: CompanyHeaderProps) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="h-16 w-16 rounded-2xl object-contain border border-slate-200 dark:border-slate-800 p-1 bg-white shrink-0 shadow-md mt-0.5"
            />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shrink-0 mt-0.5">
              {company.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {company.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50">
                {company.workplaceType}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {company.industry} • {company.size}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" />
                <span>{company.headquarters}</span>
              </div>

              {company.website && (
                <div className="flex items-center gap-1.5">
                  <ExternalLink size={13} className="text-indigo-500" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>

            {company.tags && company.tags.length > 0 && (
              <div className="pt-2">
                <Tags tags={company.tags} size="sm" onTagClick={onTagClick} />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          {onEditCompany && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditCompany}
              leftIcon={<Edit2 size={14} />}
            >
              Edit Company
            </Button>
          )}

          {onAddRecruiter && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddRecruiter}
              leftIcon={<UserPlus size={14} />}
            >
              Add Recruiter
            </Button>
          )}

          {onLogInteraction && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogInteraction}
              leftIcon={<MessageSquare size={14} />}
            >
              Log Interaction
            </Button>
          )}

          {onAddNote && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAddNote}
              leftIcon={<Plus size={14} />}
            >
              Add Note
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
