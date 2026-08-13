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
    chips: ["Analyze my resume", "How can I improve my ATS score?", "Why is my ATS score 70?", "Rewrite bullet"],
  },
  jobs: {
    name: "Senior Recruiter",
    role: "Tech Talent Scout & JD Analyst",
    avatarIcon: Briefcase,
    badgeColor: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    greeting: "Hi 👋 I'm your Senior Tech Recruiter. Ask me to analyze job descriptions, calculate profile match fit, or estimate salaries!",
    chips: ["Explain this job", "Calculate match fit", "Write a cover letter for this job", "What salary should I target?"],
  },
  interview: {
    name: "Senior Interviewer",
    role: "Engineering Director & Mock Round Evaluator",
    avatarIcon: Video,
    badgeColor: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    greeting: "Hi 👋 I'm your Senior Engineering Interviewer. Ready for technical questions or answer evaluations?",
    chips: ["Give me a React interview question", "Ask me a System Design question", "How should I prepare for React interviews?", "Evaluate my answer"],
  },
  career: {
    name: "Career Mentor",
    role: "Executive Career Coach & Strategist",
    avatarIcon: Target,
    badgeColor: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    greeting: "Hi 👋 I'm your Executive Career Mentor. Ask me for personalized 30-60-90 day growth roadmaps, skill gap analysis, or promotion strategy!",
    chips: ["Create a 30-60-90 day plan", "What skills am I missing?", "How can I get promoted to Staff Engineer?", "Salary growth strategy"],
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeMessages = tabHistories[activeTab] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping]);

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
    <div className="flex flex-col h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* AI COACH HEADER */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>AI Coach</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
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
          className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Clear chat history"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* ACTIVE RESUME INDICATOR */}
      {activeResumeFileName && (
        <div className="px-4 py-1.5 bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
          <span>✓ Active Resume: {activeResumeFileName}</span>
        </div>
      )}

      {/* MESSAGES BODY */}
      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 min-h-[320px] max-h-[500px]">
        {activeMessages.map((msg) => {
          const isErr = msg.text === "I couldn't generate a response right now. Please try again.";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] space-y-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`px-3.5 py-2.5 rounded-[16px] text-xs leading-relaxed font-medium group relative ${
                    msg.sender === "user"
                      ? "bg-slate-900 text-white shadow-xs"
                      : isErr
                      ? "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                >
                  {isErr && <AlertTriangle size={14} className="inline mr-1 text-rose-500" />}
                  <span className="whitespace-pre-line">{msg.text}</span>

                  {msg.sender === "assistant" && !isErr && (
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="ml-2 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 cursor-pointer inline-flex items-center"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 px-1 block">
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-[16px] bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
              <span>AI Coach is analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* SUGGESTION PROMPT CHIPS FORMATTED AS SLEEK ROUNDED PILLS */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
          Suggested Prompts:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {currentPersona.chips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all cursor-pointer shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* STICKY BOTTOM INPUT CONTROLS FOOTER */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-end gap-2 sticky bottom-0 z-10">
        <textarea
          rows={2}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${currentPersona.name}...`}
          className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium"
        />
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isTyping}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors shrink-0 cursor-pointer shadow-sm shadow-indigo-600/20"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
