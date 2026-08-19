import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  delay?: number;
}

export default function SearchInput({
  value: externalValue,
  onChange,
  placeholder = "Search...",
  className = "",
  delay = 200,
}: SearchInputProps) {
  const [prevExternalValue, setPrevExternalValue] = useState(externalValue);
  const [searchTerm, setSearchTerm] = useState(externalValue || "");

  if (externalValue !== undefined && externalValue !== prevExternalValue) {
    setPrevExternalValue(externalValue);
    setSearchTerm(externalValue);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, onChange, delay]);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
        <Search size={16} />
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-10 pr-9 py-2.5 text-sm transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/25 focus:border-blue-500"
      />

      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm("");
            onChange("");
          }}
          className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          type="button"
          aria-label="Clear search query"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
