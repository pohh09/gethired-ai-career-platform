import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Briefcase,
  User,
  Settings,
  BarChart3,
  Calendar,
  ArrowRight,
  FileCheck,
  Sparkles,
} from "lucide-react";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const staticCommands = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      category: "Navigation",
      description: "Real-time pipeline overview, streak & wins",
    },
    {
      name: "Jobs Pipeline & Search",
      path: "/jobs",
      icon: Briefcase,
      category: "Navigation",
      description: "Manage applications, discovery, and status",
    },
    {
      name: "Resumes & Documents",
      path: "/resumes",
      icon: FileCheck,
      category: "Documents",
      description: "Master resumes, cover letters, and shared drafts",
    },
    {
      name: "Guided AI Resume Builder",
      path: "/resumes/builder",
      icon: Sparkles,
      category: "AI Tools",
      description: "Step-by-step ATS resume builder with AI",
    },
    {
      name: "Interview Prep Simulator",
      path: "/interview-prep",
      icon: Sparkles,
      category: "Interview",
      description: "Practice mock interview rounds with real-time feedback",
    },
    {
      name: "Community Hub & Streaks",
      path: "/community",
      icon: User,
      category: "Community",
      description: "Peer resume feedback, accountability streak, and success wall",
    },
    {
      name: "Analytics & Activity",
      path: "/analytics",
      icon: BarChart3,
      category: "Analytics",
      description: "Conversion charts, action audit trail & notifications",
    },
    {
      name: "Calendar & Deadlines",
      path: "/calendar",
      icon: Calendar,
      category: "Tools",
      description: "Interview schedules and follow-up deadlines",
    },
    {
      name: "User Profile",
      path: "/profile",
      icon: User,
      category: "Account",
      description: "Personal details, experience & job targets",
    },
    {
      name: "Settings & Preferences",
      path: "/settings",
      icon: Settings,
      category: "Account",
      description: "Theme preferences, privacy & account options",
    },
  ];

  const allItems = [...staticCommands];

  const filteredItems = allItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredItems.length) % (filteredItems.length || 1),
        );
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        const item = filteredItems[selectedIndex];
        navigate(item.path);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search applications, companies, saved jobs, documents..."
                className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-medium">
                  No matching pages, jobs, or documents found.
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={`${item.name}-${index}`}
                      type="button"
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${isSelected
                        ? "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-cyan-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected
                            ? "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold truncate">
                            {item.name}
                          </span>
                          <span className="block text-[11px] text-slate-400 dark:text-slate-500 truncate">
                            {item.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {item.category}
                        </span>
                        {isSelected && (
                          <ArrowRight
                            size={14}
                            className="text-blue-600 dark:text-cyan-400"
                          />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px]">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px]">
                    ↓
                  </kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px]">
                    ↵
                  </kbd>
                  to select
                </span>
              </div>
              <span>GetHired Global Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
