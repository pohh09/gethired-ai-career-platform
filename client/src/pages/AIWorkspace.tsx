import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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
    activeClass: "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20",
    iconBgActive: "bg-indigo-500 text-white",
  },
  {
    id: "jobs",
    label: "Jobs",
    desc: "JD Analysis & Fit Match",
    icon: Briefcase,
    activeClass: "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20",
    iconBgActive: "bg-purple-500 text-white",
  },
  {
    id: "interview",
    label: "Interview",
    desc: "Mock Simulator & Evaluator",
    icon: Video,
    activeClass: "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20",
    iconBgActive: "bg-amber-500 text-white",
  },
  {
    id: "career",
    label: "Career",
    desc: "Growth Planner & Skill Matrix",
    icon: TrendingUp,
    activeClass: "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20",
    iconBgActive: "bg-emerald-500 text-white",
  },
];

export default function AIWorkspace() {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as AIModuleId) || "resume";

  const [activeTab, setActiveTab] = useState<AIModuleId>(
    ["resume", "jobs", "interview", "career"].includes(initialTab) ? initialTab : "resume"
  );

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  return (
    <div className="w-full max-w-[1750px] mx-auto space-y-8 pb-16 overflow-x-hidden">
      {/* 1. HERO BAR (PRESERVED FULL HEIGHT & VISUAL IMPACT) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} className="text-indigo-400" />
            AI Career Operating System
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            GetHired Career Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Optimized resume audits, job description intelligence, mock interview simulation, and career growth strategy.
          </p>
        </div>

        {/* MOBILE & TABLET (<1280px) AI COACH TRIGGER BUTTON */}
        <button
          type="button"
          onClick={() => setIsMobileChatOpen(true)}
          className="xl:hidden inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all shrink-0 cursor-pointer w-full sm:w-auto"
        >
          <Bot size={16} />
          <span>Open AI Coach</span>
        </button>
      </div>

      {/* 2. HORIZONTAL WORKSPACE NAVIGATION (4 MODULE CARDS BELOW HERO) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full min-h-[76px] flex items-center justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? `${item.activeClass} shadow-md`
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    isActive
                      ? item.iconBgActive
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-sm sm:text-base font-extrabold block truncate leading-tight">
                    {item.label}
                  </span>
                  <span
                    className={`text-xs truncate block mt-1 font-medium ${
                      isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.desc}
                  </span>
                </div>
              </div>
              {isActive && (
                <ChevronRight size={18} className="shrink-0 text-white hidden sm:block" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. MAIN WORKSPACE CANVAS + RIGHT CHAT PANEL SIDE-BY-SIDE */}
      <div className="flex flex-col xl:flex-row gap-8 items-start w-full">
        {/* EXPANDED MAIN CONTENT CANVAS COLUMN */}
        <div className="flex-1 min-w-0 w-full space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="w-full space-y-8"
            >
              {activeTab === "resume" && <ResumeWorkspace />}
              {activeTab === "jobs" && <JobsWorkspace />}
              {activeTab === "interview" && <InterviewWorkspace />}
              {activeTab === "career" && <CareerWorkspace />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT DESKTOP STICKY AI COACH PANEL (380-400px WIDTH) */}
        <div className="hidden xl:block w-[380px] 2xl:w-[400px] shrink-0 sticky top-6 space-y-4">
          <AIChatAssistant activeTab={activeTab} />
        </div>
      </div>

      {/* MOBILE / TABLET AI COACH SLIDE-UP DRAWER */}
      <AnimatePresence>
        {isMobileChatOpen && (
          <div className="fixed inset-0 z-50 xl:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileChatOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-h-[88vh] h-[680px] bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col z-10"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Bot size={18} className="text-indigo-500" /> AI Career Coach
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileChatOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden p-3">
                <AIChatAssistant activeTab={activeTab} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
