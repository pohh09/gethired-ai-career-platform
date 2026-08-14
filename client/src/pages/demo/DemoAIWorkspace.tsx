import { useState, useRef } from "react";
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
  Send,
  RefreshCw,
  Copy,
  Zap,
  Download,
  FileCode,
  CheckCircle2,
  Play,
  HelpCircle as QuestionIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import {
  DEMO_RESUME_TEXT,
  DEMO_ATS_AUDIT,
  DEMO_CHAT_MESSAGES,
} from "../../data/demoData";

type DemoModuleId = "resume" | "jobs" | "interview" | "career";

const NAV_ITEMS: {
  id: DemoModuleId;
  label: string;
  desc: string;
  icon: any;
  activeClass: string;
  iconBgActive: string;
}[] = [
  {
    id: "resume",
    label: "Resume",
    desc: "ATS Analysis & STAR Rewriter",
    icon: FileText,
    activeClass: "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20",
    iconBgActive: "bg-indigo-500 text-white",
  },
  {
    id: "jobs",
    label: "Jobs",
    desc: "JD Analysis & Fit Match",
    icon: Briefcase,
    activeClass: "bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-600/20",
    iconBgActive: "bg-purple-500 text-white",
  },
  {
    id: "interview",
    label: "Interview",
    desc: "Mock Simulator & Evaluator",
    icon: Video,
    activeClass: "bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/20",
    iconBgActive: "bg-amber-500 text-white",
  },
  {
    id: "career",
    label: "Career",
    desc: "Growth Planner & Skill Matrix",
    icon: TrendingUp,
    activeClass: "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20",
    iconBgActive: "bg-emerald-500 text-white",
  },
];

export default function DemoAIWorkspace() {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as DemoModuleId) || "resume";

  const [activeTab, setActiveTab] = useState<DemoModuleId>(
    ["resume", "jobs", "interview", "career"].includes(initialTab) ? initialTab : "resume"
  );

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState(DEMO_CHAT_MESSAGES);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [targetRole, setTargetRole] = useState("Senior Frontend Architect");
  const [resumeText, setResumeText] = useState(DEMO_RESUME_TEXT);
  const [bulletInput, setBulletInput] = useState("Architected microservice endpoints and reduced database load.");

  const [starResult, setStarResult] = useState<any>({
    original: "Architected microservice endpoints and reduced database load.",
    rewritten:
      "Architected distributed Node.js microservices with Redis sliding-window caching, scaling system throughput to 15,000 RPS while reducing database latency by 48% during peak payment transaction events.",
    whyBetter: "Quantified metric impact (15,000 RPS, 48% latency cut) and specified high-scale technologies (Redis, Node.js).",
  });

  const [showInterviewStartedModal, setShowInterviewStartedModal] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user" as const,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg("");
    setIsTyping(true);

    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 50);

    setTimeout(() => {
      let botReply = "Demo Mode — AI responses are simulated using sample candidate data. Create an account to run live Gemini AI audits and real-time interview coaching!";

      if (text.toLowerCase().includes("ats")) {
        botReply = "Your current resume has an ATS Readiness Score of 94/100 (Grade A+). It has strong coverage of React, TypeScript, and distributed systems. Adding Docker and Kubernetes will push it to 98%!";
      } else if (text.toLowerCase().includes("interview")) {
        botReply = "For your upcoming Stripe round tomorrow at 10:00 AM, review React 19 concurrent features, micro-frontend module federation, and sub-second Web Vitals optimization.";
      } else if (text.toLowerCase().includes("salary")) {
        botReply = "Market benchmarks for a Senior Full Stack Engineer in Bangalore range from ₹35L to ₹52L LPA base, plus equity. Your profile is positioned in the top 5th percentile.";
      }

      const botMsg = {
        id: `a-${Date.now()}`,
        sender: "assistant" as const,
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 50);
    }, 700);
  };

  const handleCopy = (_id: string, text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const exportMarkdown = () => {
    const blob = new Blob([resumeText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Alex_Johnson_Resume_Demo.md`;
    a.click();
    toast.success("Exported Markdown (.md)");
  };

  const exportPDF = () => {
    window.print();
    toast.success("Opening PDF Print Dialog");
  };

  return (
    <div className="w-full max-w-[1750px] mx-auto space-y-4 sm:space-y-6 pb-16 sm:pb-12 px-1 sm:px-0 overflow-x-hidden">
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            <Sparkles size={12} className="text-indigo-400" />
            AI Career Operating System (Demo Mode)
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white">
            GetHired Career Intelligence
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-medium">
            Pre-loaded with Alex Johnson's 94% ATS resume audit, Stripe JD analysis, mock interview rubric, and career progression roadmap.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileChatOpen(true)}
          className="xl:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all shrink-0 cursor-pointer w-full md:w-auto"
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
          {activeTab === "resume" && (
            <div className="space-y-6 w-full">
              <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border border-indigo-200">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                        Resume Intelligence Engine
                      </h2>
                      <p className="text-xs text-slate-500">
                        ATS readiness scan, STAR rewriter, and multi-format exports
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200">
                      ✓ Active: Alex_Johnson_Resume.pdf
                    </span>
                  </div>
                </div>

                <div className="space-y-4 w-full">
                  <Input
                    label="Target Job Title / Role"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full"
                  />

                  <Textarea
                    label="Resume Profile Context"
                    rows={5}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full font-mono text-xs"
                  />

                  <div className="space-y-2">
                    <Input
                      label="Individual Bullet Point for STAR Rewriter"
                      value={bulletInput}
                      onChange={(e) => setBulletInput(e.target.value)}
                      className="w-full"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStarResult({
                          original: bulletInput,
                          rewritten: `Architected distributed Node.js microservices with Redis sliding-window caching, scaling system throughput to 15,000 RPS while reducing database latency by 48% during peak transaction events.`,
                          whyBetter: "Quantified metric impact and detailed modern technical architecture.",
                        });
                        toast.success("Rewritten with STAR method (Demo)");
                      }}
                      leftIcon={<Zap size={14} />}
                    >
                      Rewrite STAR Bullet
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={exportMarkdown} leftIcon={<FileCode size={14} />}>
                    Export .md
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportPDF} leftIcon={<Download size={14} />}>
                    Export PDF
                  </Button>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 w-full">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles size={17} className="text-indigo-500" />
                    Full Resume Audit Report (ATS Scanned)
                  </h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Grade: {DEMO_ATS_AUDIT.overallGrade}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  <div className="lg:col-span-4 p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center flex flex-col justify-center items-center">
                    <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">ATS Readiness Score</span>
                    <span className="text-4xl font-black text-slate-900 dark:text-slate-100 my-1">{DEMO_ATS_AUDIT.atsScore} / 100</span>
                    <span className="text-xs font-bold text-indigo-600">Grade A+ (Highly Competitive)</span>
                  </div>

                  <div className="lg:col-span-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block">Executive Summary:</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{DEMO_ATS_AUDIT.summary}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Section Review Scores:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(DEMO_ATS_AUDIT.sectionBySection).map(([section, info]: [string, any]) => (
                      <div key={section} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold capitalize text-slate-900 dark:text-slate-100">{section}</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {info.score}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{info.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">Detected Keywords:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {DEMO_ATS_AUDIT.keywordAnalysis.foundKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">Missing High-Impact Keywords:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {DEMO_ATS_AUDIT.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-[11px] font-bold">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block uppercase tracking-wider">
                    Recommended Action Plan:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {DEMO_ATS_AUDIT.actionPlan.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {starResult && (
                <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 w-full">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Zap size={17} className="text-amber-500" />
                      STAR Bullet Transformation Example
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy("star", starResult.rewritten)} leftIcon={<Copy size={13} />}>
                      Copy Bullet
                    </Button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Original Input:</span>
                    <p className="text-slate-600 dark:text-slate-400 italic font-medium">"{starResult.original}"</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">✨ STAR Rewritten Bullet:</span>
                    <p className="text-slate-900 dark:text-slate-100 font-extrabold text-sm leading-relaxed">{starResult.rewritten}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="space-y-6 w-full">
              <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 w-full">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 border border-purple-200">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                        Job Description Match Engine
                      </h2>
                      <p className="text-xs text-slate-500">Stripe — Senior Frontend Architect</p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-3.5 py-1 rounded-full bg-purple-600 text-white shadow-2xs">
                    96% Profile Fit
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider block">✓ Matched Core Skills:</span>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {["React 19 & TypeScript (5+ Years)", "Core Web Vitals Optimization (65% LCP speedup)", "Micro-frontends & State Orchestration", "Design Systems & High-Velocity UI"].map((m, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">⚠ Minor Nice-to-Haves:</span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {["GraphQL Apollo Client Caching", "WebAssembly (WASM) edge processing"].map((m, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-slate-400 font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Tailored Cover Letter Draft
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy("cl", "Dear Hiring Team at Stripe...")}
                      leftIcon={<Copy size={13} />}
                    >
                      Copy Letter
                    </Button>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                    "Dear Stripe Hiring Team, I am writing to express my strong enthusiasm for the Senior Frontend Architect position. Having scaled enterprise dashboards serving 150,000+ daily active users and improved Core Web Vitals (LCP) by 65%, my expertise in React 19, TypeScript, and micro-frontend architecture aligns directly with Stripe's standard of engineering excellence..."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "interview" && (
            <div className="space-y-6 w-full">
              <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200">
                      <Video size={18} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                        Mock Interview Simulator & Rubric
                      </h2>
                      <p className="text-xs text-slate-500">
                        12-Question progressive technical and architectural evaluation
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowInterviewStartedModal(true)}
                    leftIcon={<Play size={14} />}
                    className="bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-600/20"
                  >
                    Start Interview
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span className="flex items-center gap-1.5 uppercase">
                      <QuestionIcon size={14} /> Question 1 of 12 (Sample Review)
                    </span>
                    <span className="text-slate-400">Difficulty: <strong className="text-white">Advanced</strong></span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    "How does React 19 Concurrent Mode prioritize state updates during high-frequency user interactions, and how would you diagnose unnecessary re-renders in a complex micro-frontend dashboard?"
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                      Evaluated Sample Answer & Rubric
                    </h4>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                      Score: 95/100 (Correct)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Accuracy</span>
                      <span className="font-extrabold text-emerald-600 mt-0.5 block">96%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Communication</span>
                      <span className="font-extrabold text-emerald-600 mt-0.5 block">94%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Completeness</span>
                      <span className="font-extrabold text-emerald-600 mt-0.5 block">95%</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <strong>Strengths:</strong> Candidate explained fiber tree lane prioritization, startTransition deferred state, and Chrome DevTools profiler flamegraphs accurately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "career" && (
            <div className="space-y-6 w-full">
              <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 w-full">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                        Staff Engineer Career Growth Roadmap
                      </h2>
                      <p className="text-xs text-slate-500">6-Month progression plan & skill mastery matrix</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Senior Engineer → Staff Architect
                  </span>
                </div>

                <div className="relative pl-7 space-y-4 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {[
                    { month: "Month 1-2", title: "Micro-Frontend & Edge Architecture", desc: "Design resilient micro-frontends with Module Federation, sub-second LCP optimization, and Edge rendering." },
                    { month: "Month 3-4", title: "Distributed Microservices & Event Streams", desc: "Architect Kafka event streaming pipelines and Redis distributed locking mechanisms." },
                    { month: "Month 5-6", title: "High-Availability System Design & Executive Alignment", desc: "Cross-functional leadership, RFC writing, fault-tolerant failovers, and executive offer negotiation." },
                  ].map((step, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <div className="absolute -left-7 top-0.5 h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                        {step.month}
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden xl:block w-[360px] 2xl:w-[380px] shrink-0 sticky top-4 space-y-4">
          <div className="flex flex-col h-[650px] max-h-[calc(100vh-140px)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden w-full">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border border-indigo-200 shrink-0">
                  <Bot size={17} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>AI Coach</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Demo Mode • Simulated Coach</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setChatMessages(DEMO_CHAT_MESSAGES)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                title="Reset conversation"
              >
                <RefreshCw size={13} />
              </button>
            </div>

            <div className="px-4 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
              ✓ Active Resume: Alex_Johnson_Resume.pdf
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 min-h-0"
            >
              {chatMessages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[88%] space-y-1 ${isUser ? "text-right" : "text-left"}`}>
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-medium shadow-2xs ${
                          isUser
                            ? "bg-slate-900 dark:bg-indigo-600 text-white rounded-tr-xs"
                            : "bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/70 rounded-tl-xs"
                        }`}
                      >
                        <span className="whitespace-pre-line">{msg.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 px-1 block font-medium">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs flex items-center gap-1.5 rounded-tl-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
                    <span>Analyzing with AI...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 space-y-1.5 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Sample Prompts:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  "Analyze my ATS score",
                  "Prepare for Stripe round",
                  "Rewrite STAR bullets",
                  "What salary should I ask?",
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip)}
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 text-left hover:border-indigo-500 hover:text-indigo-600 transition-all cursor-pointer leading-tight truncate"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-end gap-2 shrink-0">
              <textarea
                rows={2}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask AI Coach (try typing anything)..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium min-h-[38px] max-h-[85px]"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMsg.trim() || isTyping}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-all shrink-0 cursor-pointer shadow-sm shadow-indigo-600/20"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

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
                  <Bot size={16} className="text-indigo-500" /> AI Career Coach (Demo)
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileChatOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 min-h-0">
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[88%] space-y-1 ${isUser ? "text-right" : "text-left"}`}>
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-medium shadow-2xs ${
                            isUser
                              ? "bg-slate-900 dark:bg-indigo-600 text-white rounded-tr-xs"
                              : "bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/70 rounded-tl-xs"
                          }`}
                        >
                          <span className="whitespace-pre-line">{msg.text}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 px-1 block font-medium">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-end gap-2 shrink-0">
                <textarea
                  rows={2}
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Ask AI Coach..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none font-medium min-h-[38px] max-h-[85px]"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMsg.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInterviewStartedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInterviewStartedModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-4 z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Video size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                AI Interview Simulator
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Demo Mode: Create a free account to practice live adaptive AI interview sessions, voice recording evaluation, and individualized answer feedback.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInterviewStartedModal(false);
                    toast.success("Demo interview question loaded above!");
                  }}
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all block text-center"
                >
                  Explore Demo Question
                </button>
                <button
                  type="button"
                  onClick={() => setShowInterviewStartedModal(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
