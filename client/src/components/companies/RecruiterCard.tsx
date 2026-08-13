import { Mail, Phone, ExternalLink, Calendar, Trash2, Edit2 } from "lucide-react";
import type { Recruiter, RelationshipStatus } from "../../types/company";

export interface RecruiterCardProps {
  recruiter: Recruiter;
  onEdit?: (recruiter: Recruiter) => void;
  onDelete?: (recruiterId: string) => void;
  className?: string;
}

export default function RecruiterCard({
  recruiter,
  onEdit,
  onDelete,
  className = "",
}: RecruiterCardProps) {
  const getStatusBadge = (status: RelationshipStatus) => {
    switch (status) {
      case "Referral":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40";
      case "Active":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/40";
      case "Warm":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className={`group p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-all flex flex-col justify-between space-y-4 ${className}`}>
      <div>

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0">
              {getInitials(recruiter.name)}
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {recruiter.name}
              </h4>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {recruiter.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                recruiter.relationshipStatus
              )}`}
            >
              {recruiter.relationshipStatus}
            </span>

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(recruiter)}
                className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer opacity-0 group-hover:opacity-100"
                title="Edit recruiter contact"
                aria-label="Edit recruiter contact"
              >
                <Edit2 size={13} />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(recruiter.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer opacity-0 group-hover:opacity-100"
                title="Delete recruiter contact"
                aria-label="Delete recruiter contact"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>


        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 my-3 bg-slate-50/60 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
          {recruiter.email && (
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-slate-400 shrink-0" />
              <a
                href={`mailto:${recruiter.email}`}
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 truncate font-semibold"
              >
                {recruiter.email}
              </a>
            </div>
          )}

          {recruiter.phone && (
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-slate-400 shrink-0" />
              <a
                href={`tel:${recruiter.phone}`}
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 font-medium"
              >
                {recruiter.phone}
              </a>
            </div>
          )}

          {recruiter.linkedIn && (
            <div className="flex items-center gap-2 pt-0.5">
              <ExternalLink size={13} className="text-blue-500 shrink-0" />
              <a
                href={recruiter.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline truncate"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
        </div>


        {recruiter.notes && (
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-indigo-400/60 pl-2.5 my-2">
            "{recruiter.notes}"
          </p>
        )}
      </div>


      {recruiter.lastContactDate && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Calendar size={12} />
          <span>Last contact: {recruiter.lastContactDate}</span>
        </div>
      )}
    </div>
  );
}
