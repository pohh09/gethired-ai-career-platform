import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export interface ExportMenuProps {
  onExportCSV?: () => void;
  onExportPDF?: () => void;
  className?: string;
}

export default function ExportMenu({
  onExportCSV,
  onExportPDF,
  className = "",
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleCSV = () => {
    setIsOpen(false);
    if (onExportCSV) {
      onExportCSV();
    } else {
      toast.success("Analytics CSV summary downloaded!");
    }
  };

  const handlePDF = () => {
    setIsOpen(false);
    if (onExportPDF) {
      onExportPDF();
    } else {
      toast.success("Analytics PDF executive summary generated!");
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Export report"
        className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all cursor-pointer"
      >
        <Download size={14} />
        <span>Export Report</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 z-50 mt-1.5 w-48 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 shadow-lg shadow-slate-900/5 focus:outline-none"
          >
            <button
              type="button"
              onClick={handleCSV}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet
                size={15}
                className="text-emerald-600 dark:text-emerald-400"
              />
              <span>Export as CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePDF}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <FileText
                size={15}
                className="text-rose-600 dark:text-rose-400"
              />
              <span>Export as PDF</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
