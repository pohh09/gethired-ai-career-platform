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
  Building2,
  FileCheck,
  FolderOpen,
  Sparkles,
  Bookmark,
} from "lucide-react";
import { useDocumentStore } from "../../store/documentStore";

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
  const documents = useDocumentStore((state) => state.documents);

  const staticCommands = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      category: "Navigation",
      description: "Real-time analytics and tracking overview",
    },
    {
      name: "Jobs Applications",
      path: "/jobs",
      icon: Briefcase,
      category: "Navigation",
      description: "Manage ATS pipeline and track opportunities",
    },
    {
      name: "Discover Jobs",
      path: "/jobs",
      icon: Search,
      category: "Jobs",
      description: "Search live tech job postings & remote roles",
    },
    {
      name: "Saved Jobs",
      path: "/jobs",
      icon: Bookmark,
      category: "Jobs",
      description: "View saved target opportunities",
    },
    {
      name: "Companies CRM",
      path: "/companies",
      icon: Building2,
      category: "Navigation",
      description: "Target companies and recruitment CRM",
    },
    {
      name: "Resume Manager",
      path: "/resumes",
      icon: FileCheck,
      category: "Tools",
      description: "Upload, set default, and manage master resume files",
    },
    {
      name: "AI Documents",
      path: "/documents",
      icon: FolderOpen,
      category: "Tools",
      description: "View saved Cover Letters and AI reports",
    },
    {
      name: "AI Resume Optimizer",
      path: "/resume-optimizer",
      icon: Sparkles,
      category: "AI Tools",
      description: "Optimize bullet points and ATS score",
    },
    {
      name: "AI Cover Letter",
      path: "/cover-letter",
      icon: Sparkles,
      category: "AI Tools",
      description: "Generate customized cover letters",
    },
    {
      name: "Analytics & Trends",
      path: "/analytics",
      icon: BarChart3,
      category: "Analytics",
      description: "View conversion charts and weekly activity",
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
      name: "Preferences & Settings",
      path: "/settings",
      icon: Settings,
      category: "Account",
      description: "Theme preferences, default resume & options",
    },
  ];

  const documentItems = documents.map((doc) => ({
    name: doc.title,
    path: "/documents",
    icon: FolderOpen,
    category: "AI Documents",
    description: `Saved ${doc.category} document (${doc.createdAt})`,
  }));

  const allItems = [...staticCommands, ...documentItems];

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
                        ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected
                            ? "bg-indigo-600 text-white"
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
                            className="text-indigo-600 dark:text-indigo-400"
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
