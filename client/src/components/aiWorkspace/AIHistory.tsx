import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Search,
  ExternalLink,
  FileCheck2,
  Sparkles,
  Briefcase,
  HelpCircle,
  Compass,
  Calendar,
  X,
  Eye,
} from "lucide-react";
import type { AIActivityItem, AICategory } from "../../types/aiWorkspace";

interface AIHistoryProps {
  history: AIActivityItem[];
  onReopen: (item: AIActivityItem) => void;
}

const categoryFilterList: { label: string; value: "All" | AICategory }[] = [
  { label: "All Activity", value: "All" },
  { label: "Resume", value: "Resume" },
  { label: "Jobs", value: "Jobs" },
  { label: "Interview", value: "Interview" },
  { label: "Career", value: "Career" },
];

const categoryIconMap: Record<AICategory, React.ComponentType<{ size?: number; className?: string }>> = {
  Resume: FileCheck2,
  Jobs: Briefcase,
  Interview: HelpCircle,
  Career: Compass,
};

const categoryBadgeColor: Record<AICategory, string> = {
  Resume: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  Jobs: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Interview: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Career: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
};

export default function AIHistory({ history, onReopen }: AIHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | AICategory>("All");

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.type === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [history, searchQuery, selectedCategory]);

  return (
    <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History size={18} className="text-indigo-500" />
            Recent AI Activity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View previous AI runs, examine results, and reopen analyses anytime.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search AI history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>


      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categoryFilterList.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isActive
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>


      <div className="space-y-2.5 pt-1">
        <AnimatePresence mode="popLayout">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => {
              const CategoryIcon = categoryIconMap[item.type] || Sparkles;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.18, delay: index * 0.03 }}
                  className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                      <CategoryIcon size={18} />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </h4>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${categoryBadgeColor[item.type]
                            }`}
                        >
                          {item.type}
                        </span>
                        {item.score !== undefined && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Score: {item.score}%
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.summary}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {item.timeAgo}
                        </span>
                        {item.tags && item.tags.length > 0 && (
                          <span className="hidden sm:inline-block">
                            • {item.tags.join(" • ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>


                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0">
                    <button
                      type="button"
                      onClick={() => onReopen(item)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Eye size={14} className="text-indigo-500" />
                      <span>Reopen</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
              <History size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No activity found matching filters
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Try searching for something else or reset your category filter.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
