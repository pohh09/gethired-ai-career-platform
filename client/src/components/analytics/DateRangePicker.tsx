import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, Check } from "lucide-react";

export interface DateRangeOption {
  label: string;
  value: string;
}

export interface DateRangePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" },
  { label: "Last 12 Months", value: "12months" },
  { label: "All Time", value: "all" },
];

export default function DateRangePicker({
  value,
  onChange,
  className = "",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    DATE_RANGE_OPTIONS.find((opt) => opt.value === value) ||
    DATE_RANGE_OPTIONS[1];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Select date range"
        className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all cursor-pointer"
      >
        <Calendar
          size={14}
          className="text-indigo-600 dark:text-indigo-400 shrink-0"
        />
        <span>{selectedOption.label}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 z-50 mt-1.5 w-44 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 shadow-lg shadow-slate-900/5 focus:outline-none"
          >
            {DATE_RANGE_OPTIONS.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Check
                      size={14}
                      className="text-indigo-600 dark:text-indigo-400 shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
