import { motion } from "framer-motion";
import { Star, ArrowUpRight, Sparkles } from "lucide-react";
import type { AITool } from "../../types/aiWorkspace";

interface FavoriteToolsProps {
  favoriteTools: AITool[];
  onLaunch: (tool: AITool) => void;
  onToggleFavorite: (toolId: string) => void;
}

export default function FavoriteTools({
  favoriteTools,
  onLaunch,
  onToggleFavorite,
}: FavoriteToolsProps) {
  if (favoriteTools.length === 0) {
    return (
      <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-center py-6">
        <Star
          size={24}
          className="mx-auto text-slate-300 dark:text-slate-700 mb-2"
        />
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
          No favorite AI tools pinned yet
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          Click the star icon on any tool card below to pin it here for quick
          access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Star size={16} className="text-amber-500 fill-amber-400" />
          Favorites ({favoriteTools.length})
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          Quick Launch Bar
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {favoriteTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/30 dark:from-amber-950/20 dark:via-slate-900 dark:to-amber-950/10 shadow-xs flex items-center justify-between gap-3 group hover:border-amber-300 dark:hover:border-amber-800 transition-all duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {tool.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {tool.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => onToggleFavorite(tool.id)}
                title="Unpin tool"
                className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-500 transition-colors"
              >
                <Star size={14} className="fill-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => onLaunch(tool)}
                className="p-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:scale-105 transition-transform flex items-center gap-1 text-[11px] font-bold px-2.5"
              >
                <span>Launch</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
