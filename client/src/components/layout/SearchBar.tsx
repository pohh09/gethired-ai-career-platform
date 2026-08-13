import { Search, Command } from "lucide-react";

export interface SearchBarProps {
  onClick?: () => void;
  className?: string;
}

export default function SearchBar({ onClick, className = "" }: SearchBarProps) {
  const isMac =
    typeof window !== "undefined" &&
    window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-slate-400 dark:text-slate-500 hover:border-indigo-500/40 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer select-none ${className}`}
    >
      <Search
        size={14}
        className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0"
      />
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors hidden sm:inline-block">
        Search or jump to...
      </span>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:hidden">
        Search...
      </span>

      <div className="ml-auto hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-400 dark:text-slate-500 shadow-2xs">
        {isMac ? (
          <Command size={10} />
        ) : (
          <span className="text-[9px]">Ctrl</span>
        )}
        <span>K</span>
      </div>
    </button>
  );
}
