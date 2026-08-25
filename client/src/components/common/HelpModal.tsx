import { useState } from "react";
import {
  Briefcase,
  Sparkles,
  Search,
  Settings,
  ChevronRight,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQ_SECTIONS = [
  {
    id: "tracker",
    title: "Application Tracker Basics",
    icon: Briefcase,
    items: [
      {
        q: "How do I move an application between stages?",
        a: "Navigate to the Jobs tab. In the Kanban view, you can drag and drop cards between 'Applied', 'Screening', 'Interview', 'Offer', and 'Rejected', or click 'Edit' on any card to update its status.",
      },
      {
        q: "How does the '1-Click Save to Tracker' work in Discover Jobs?",
        a: "When browsing live listings in Discover Jobs, clicking the 'Track' button instantly adds that job to your active tracker with the company name, role, salary, and job description pre-filled.",
      },
      {
        q: "Can I export my tracked applications to a spreadsheet?",
        a: "Yes! Click the 'Export CSV' button on the Jobs page to download all your tracked applications, dates, and salary figures.",
      },
    ],
  },
  {
    id: "ai",
    title: "AI Workspace & Features",
    icon: Sparkles,
    items: [
      {
        q: "How does the ATS Resume Scoring work?",
        a: "GetHired uses Google Gemini 1.5 Flash to compare your resume against industry standards and specific job descriptions. It scores keyword match %, formatting compliance, and missing skills. If offline or without API keys, it falls back to a deterministic heuristic matcher.",
      },
      {
        q: "What is the STAR Bullet Rewriter?",
        a: "The STAR rewriter transforms vague resume bullets into structured Situation-Task-Action-Result accomplishment statements featuring quantified metrics and strong action verbs.",
      },
      {
        q: "How does the Adaptive Mock Interview work?",
        a: "Select your target role and interview type (Technical, Behavioral, Coding, System Design, or Managerial). The simulator presents 12 progressive questions, evaluates your answers against rubrics in real time, and adapts subsequent questions based on your performance.",
      },
    ],
  },
  {
    id: "providers",
    title: "Job Board Providers (9 Sources)",
    icon: Search,
    items: [
      {
        q: "Which job boards does GetHired aggregate?",
        a: "GetHired queries 9 global job sources: Adzuna, Jooble, RemoteOK, Greenhouse, Lever, USAJobs, JSearch (LinkedIn/Indeed/Glassdoor), Arbeitnow, and RapidJobs.",
      },
      {
        q: "Do I need API keys to discover jobs?",
        a: "No! Public providers like RemoteOK, Arbeitnow, Greenhouse, and Lever work out of the box. Optional API keys for Adzuna, Jooble, and JSearch can be configured in your backend .env file.",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings & Preferences",
    icon: Settings,
    items: [
      {
        q: "How do I choose my default master resume?",
        a: "Go to Settings → Default Master Resume and select your primary resume. This resume is automatically pre-loaded when tailoring resumes and generating cover letters.",
      },
      {
        q: "How do I switch themes?",
        a: "You can toggle Light, Dark, or System Preference in Settings → Theme Appearance, or use the theme button in the top navigation bar.",
      },
    ],
  },
];

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeSection, setActiveSection] = useState("tracker");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const currentSection = FAQ_SECTIONS.find((s) => s.id === activeSection) || FAQ_SECTIONS[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="GetHired Help & Documentation" maxWidth="2xl">
      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2 text-white">
              <BookOpen size={16} className="text-cyan-400" />
              GetHired Knowledge Base & FAQs
            </h3>
            <p className="text-xs text-slate-300">
              Learn how to get the most out of your job tracker, AI tools, and search engine.
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FAQ_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setActiveSection(sec.id);
                  setOpenFaqIndex(0);
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={16} className={isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
                <span className="text-center leading-tight truncate w-full">{sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2.5 min-h-[220px]">
          {currentSection.items.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-500 shrink-0" />
                    {item.q}
                  </span>
                  <ChevronRight
                    size={14}
                    className={`text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-90 text-indigo-600" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="primary" size="sm" onClick={onClose}>
            Got it, thanks!
          </Button>
        </div>
      </div>
    </Modal>
  );
}
