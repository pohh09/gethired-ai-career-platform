import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Send,
  RefreshCw,
  Briefcase,
  Target,
  Video,
  Copy,
  Check,
  AlertTriangle,
  Bot,
} from "lucide-react";
import toast from "react-hot-toast";

import type { AIChatMessage, AIModuleId } from "../../types/aiWorkspace";
import { useResumeStore } from "../../store/resumeStore";
import * as aiService from "../../services/aiWorkspaceService";

interface AIChatAssistantProps {
  activeTab: AIModuleId;
}

interface CoachPersona {
  name: string;
  role: string;
  avatarIcon: any;
  badgeColor: string;
  greeting: string;
  chips: string[];
}

const PERSONAS: Record<AIModuleId, CoachPersona> = {
  resume: {
    name: "Resume Expert",
    role: "ATS & Resume Optimization",
    avatarIcon: Sparkles,
    badgeColor: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    greeting: "Hi 👋 I'm your Resume Optimization Expert. Ask me to audit your ATS score, rewrite STAR bullets, or review your resume!",
    chips: [
      "Analyze my resume",
      "How to improve ATS score?",
      "Why is my ATS score 70?",
      "Rewrite bullet in STAR format",
    ],
  },
  jobs: {
    name: "Senior Recruiter",
    role: "Tech Talent Scout & JD Analyst",
    avatarIcon: Briefcase,
    badgeColor: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    greeting: "Hi 👋 I'm your Senior Tech Recruiter. Ask me to analyze job descriptions, calculate profile match fit, or estimate salaries!",
    chips: [
      "Explain this job in simple terms",
      "Calculate match fit score",
      "Write tailored cover letter",
      "What salary should I target?",
    ],
  },
  interview: {
    name: "Senior Interviewer",
    role: "Engineering Director & Mock Round Evaluator",
    avatarIcon: Video,
    badgeColor: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    greeting: "Hi 👋 I'm your Senior Engineering Interviewer. Ready for technical questions, behavioral rounds, or answer evaluations?",
    chips: [
      "Give me a React interview question",
      "Ask a System Design question",
      "Prepare for React tech rounds",
      "Evaluate my previous answer",
    ],
  },
  career: {
    name: "Career Mentor",
    role: "Executive Career Coach & Strategist",
    avatarIcon: Target,
    badgeColor: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    greeting: "Hi 👋 I'm your Executive Career Mentor. Ask me for personalized 30-60-90 day growth roadmaps, skill gap analysis, or promotion strategy!",
    chips: [
      "Create 30-60-90 day plan",
      "What skills am I missing?",
      "How to reach Staff Engineer?",
      "Salary negotiation strategy",
    ],
  },
};

export default function AIChatAssistant({ activeTab }: AIChatAssistantProps) {
  const { activeResumeText, activeResumeFileName } = useResumeStore();
  const currentPersona = PERSONAS[activeTab] || PERSONAS.resume;

  const [tabHistories, setTabHistories] = useState<Record<AIModuleId, AIChatMessage[]>>({
    resume: [{ id: "init-r", sender: "assistant", text: PERSONAS.resume.greeting, timestamp: "Just now" }],
    jobs: [{ id: "init-j", sender: "assistant", text: PERSONAS.jobs.greeting, timestamp: "Just now" }],
    interview: [{ id: "init-i", sender: "assistant", text: PERSONAS.interview.greeting, timestamp: "Just now" }],
    career: [{ id: "init-c", sender: "assistant", text: PERSONAS.career.greeting, timestamp: "Just now" }],
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);
  const isInitialMount = useRef(true);

  const activeMessages = tabHistories[activeTab] || [];

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevMessageCountRef.current = activeMessages.length;
      return;
    }

    if (activeMessages.length > prevMessageCountRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    prevMessageCountRef.current = activeMessages.length;
  }, [activeMessages.length]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isTyping) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setTabHistories((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), userMsg],
    }));

    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50);

    try {
      const response = await aiService.sendChatMessage({
        message: query.trim(),
        activeTab,
        resumeText: activeResumeText,
        chatHistory: activeMessages.slice(-6),
      });

      const assistantMsg: AIChatMessage = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setTabHistories((prev) => ({
        ...prev,
        [activeTab]: [...(prev[activeTab] || []), assistantMsg],
      }));
    } catch (_err) {
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "I couldn't generate a response right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setTabHistories((prev) => ({
        ...prev,
        [activeTab]: [...(prev[activeTab] || []), errorMsg],
      }));
      toast.error("Failed to generate response. Please try again.");
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[650px] max-h-[calc(100vh-140px)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden w-full">

      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0 shadow-2xs">
            <Bot size={17} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 leading-tight">
              <span>AI Coach</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              {currentPersona.name} • {currentPersona.role}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setTabHistories((prev) => ({
              ...prev,
              [activeTab]: [{ id: `init-${Date.now()}`, sender: "assistant", text: currentPersona.greeting, timestamp: "Just now" }],
            }))
          }
          className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title="Clear chat history"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {activeResumeFileName && (
        <div className="px-4 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-between shrink-0">
          <span className="truncate">✓ Active: {activeResumeFileName}</span>
        </div>
      )}

      <div
        ref={messagesContainerRef}
        className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 min-h-0"
      >
        {activeMessages.map((msg) => {
          const isErr = msg.text === "I couldn't generate a response right now. Please try again.";
          const isUser = msg.sender === "user";

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[90%] space-y-1 ${isUser ? "text-right" : "text-left"}`}>
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-medium group relative shadow-2xs ${isUser
                    ? "bg-slate-900 dark:bg-indigo-600 text-white rounded-tr-xs"
                    : isErr
                      ? "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 rounded-tl-xs"
                      : "bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/70 rounded-tl-xs"
                    }`}
                >
                  {isErr && <AlertTriangle size={13} className="inline mr-1 text-rose-500" />}
                  <span className="whitespace-pre-line">{msg.text}</span>

                  {!isUser && !isErr && (
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="ml-1.5 p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer inline-flex items-center transition-colors align-middle"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 px-1 block font-medium">
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs flex items-center gap-1.5 rounded-tl-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span>Analyzing...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 space-y-2 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
          Suggested Prompts:
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {currentPersona.chips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-left hover:border-indigo-500 hover:text-indigo-600 hover:shadow-xs transition-all cursor-pointer leading-tight line-clamp-2"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-end gap-2 shrink-0">
        <textarea
          rows={2}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${currentPersona.name}...`}
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium min-h-[40px] max-h-[90px] transition-all"
        />
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isTyping}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-all shrink-0 cursor-pointer shadow-sm shadow-indigo-600/20"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
