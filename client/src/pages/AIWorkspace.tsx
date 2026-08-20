import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Briefcase,
  Video,
  TrendingUp,
  Bot,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import ResumeWorkspace from "../components/aiWorkspace/tabs/ResumeWorkspace";
import JobsWorkspace from "../components/aiWorkspace/tabs/JobsWorkspace";
import InterviewWorkspace from "../components/aiWorkspace/tabs/InterviewWorkspace";
import CareerWorkspace from "../components/aiWorkspace/tabs/CareerWorkspace";
import AIChatAssistant from "../components/aiWorkspace/AIChatAssistant";
import type { AIModuleId } from "../types/aiWorkspace";

const NAV_ITEMS: {
  id: AIModuleId;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number }>;
  activeClass: string;
  iconBgActive: string;
}[] = [
  {
    id: "resume",
    label: "Resume",
    desc: "ATS Analysis & STAR Rewriter",
    icon: FileText,
    activeClass: "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20",
    iconBgActive: "bg-blue-500 text-white",
  },
  {
    id: "jobs",
    label: "Jobs",
    desc: "JD Analysis & Fit Match",
    icon: Briefcase,
    activeClass: "bg-cyan-600 text-white border-cyan-600 shadow-sm shadow-cyan-600/20",
    iconBgActive: "bg-cyan-500 text-white",
  },
  {
    id: "interview",
    label: "Interview",
    desc: "Mock Simulator & Evaluator",
    icon: Video,
    activeClass: "bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-600/20",
    iconBgActive: "bg-sky-500 text-white",
  },
  {
    id: "career",
    label: "Career",
    desc: "Growth Planner & Skill Matrix",
    icon: TrendingUp,
    activeClass: "bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/20",
    iconBgActive: "bg-teal-500 text-white",
  },
];

export default function AIWorkspace() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const getInitialTab = (): AIModuleId => {
    if (location.pathname.includes("interview")) return "interview";
    const tab = searchParams.get("tab") as AIModuleId;
    if (["resume", "jobs", "interview", "career"].includes(tab)) return tab;
    return "resume";
  };

  const [activeTab, setActiveTab] = useState<AIModuleId>(getInitialTab());

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname, searchParams]);

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  return (
    <div className="w-full max-w-[1750px] mx-auto space-y-4 sm:space-y-6 pb-16 sm:pb-12 px-1 sm:px-0 overflow-x-hidden">
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-blue-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            <Sparkles size={12} className="text-cyan-400" />
            AI Career Operating System
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white">
            GetHired Career Intelligence
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-medium">
            Optimized resume audits, job description intelligence, mock interview simulation, and career growth strategy.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileChatOpen(true)}
          className="xl:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all shrink-0 cursor-pointer w-full md:w-auto"
        >
          <Bot size={15} />
          <span>Open AI Coach</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 w-full">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full min-h-[58px] sm:min-h-[64px] flex items-center justify-between p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? `${item.activeClass} shadow-sm`
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div
                  className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 transition-colors ${
                    isActive
                      ? item.iconBgActive
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-extrabold block truncate leading-tight">
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] sm:text-[11px] truncate block mt-0.5 font-medium ${
                      isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.desc}
                  </span>
                </div>
              </div>
              {isActive && (
                <ChevronRight size={16} className="shrink-0 text-white hidden md:block" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
        <div className="flex-1 min-w-0 w-full space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="w-full space-y-6"
            >
              {activeTab === "resume" && <ResumeWorkspace />}
              {activeTab === "jobs" && <JobsWorkspace />}
              {activeTab === "interview" && <InterviewWorkspace />}
              {activeTab === "career" && <CareerWorkspace />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden xl:block w-[360px] 2xl:w-[380px] shrink-0 sticky top-4 space-y-4">
          <AIChatAssistant activeTab={activeTab} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsMobileChatOpen(true)}
        className="xl:hidden fixed bottom-5 right-5 z-40 h-13 w-13 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-500 text-white shadow-xl shadow-blue-600/40 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all border-2 border-white/20"
        aria-label="Open AI Career Coach"
      >
        <Bot size={24} />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border border-white" />
        </span>
      </button>

      <AnimatePresence>
        {isMobileChatOpen && (
          <div className="fixed inset-0 z-50 xl:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileChatOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-h-[92vh] h-[660px] bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col z-10"
            >
              <div className="p-3.5 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 shrink-0">
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Bot size={16} className="text-cyan-500" /> AI Career Coach
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileChatOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden p-2 sm:p-2.5">
                <AIChatAssistant activeTab={activeTab} isMobileDrawer={true} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
