import { useState, useEffect } from "react";
import {
  Send,
  Bug,
  Lightbulb,
  HelpCircle,
  MessageCircle,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import api from "../../services/api";
import { useAuthStore } from "../../store/authStore";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEEDBACK_TYPES = [
  {
    id: "suggestion",
    label: "Feature Idea",
    description: "Suggest a new tool or enhancement",
    icon: Lightbulb,
    activeBg: "bg-amber-500/10 dark:bg-amber-500/15",
    activeBorder: "border-amber-500 text-amber-600 dark:text-amber-400",
    iconColor: "text-amber-500",
  },
  {
    id: "bug",
    label: "Bug Report",
    description: "Report an issue or unexpected error",
    icon: Bug,
    activeBg: "bg-rose-500/10 dark:bg-rose-500/15",
    activeBorder: "border-rose-500 text-rose-600 dark:text-rose-400",
    iconColor: "text-rose-500",
  },
  {
    id: "question",
    label: "Question / Help",
    description: "Ask about a feature or workflow",
    icon: HelpCircle,
    activeBg: "bg-blue-500/10 dark:bg-blue-500/15",
    activeBorder: "border-blue-500 text-blue-600 dark:text-cyan-400",
    iconColor: "text-blue-500 dark:text-cyan-400",
  },
  {
    id: "other",
    label: "General Thoughts",
    description: "Share your overall platform experience",
    icon: MessageCircle,
    activeBg: "bg-purple-500/10 dark:bg-purple-500/15",
    activeBorder: "border-purple-500 text-purple-600 dark:text-purple-400",
    iconColor: "text-purple-500 dark:text-purple-400",
  },
];

const QUICK_TAGS = [
  "🚀 AI Tools",
  "📄 Resume Builder",
  "🎯 Job Tracker",
  "✨ UI/UX Design",
  "⚡ Performance",
];

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useAuthStore();
  const [type, setType] = useState<string>("suggestion");
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.name && !authorName) setAuthorName(user.name);
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

  const handleQuickTagClick = (tag: string) => {
    const cleanTag = tag.replace(/^[^\w\s]+/, "").trim();
    if (!message.includes(`[${cleanTag}]`)) {
      setMessage((prev) => (prev ? `[${cleanTag}] ${prev}` : `[${cleanTag}] `));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter your feedback message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/feedback", {
        type,
        message: message.trim(),
        authorName: authorName.trim() || user?.name || "Anonymous",
        email: email.trim() || user?.email || "",
        pageUrl: window.location.pathname,
      });

      if (response.data?.success) {
        toast.success(
          response.data.message || "Thank you! Your feedback was delivered to our inbox.",
        );
        setMessage("");
        setType("suggestion");
        onClose();
      } else {
        toast.error("Unable to send feedback. Please try again.");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Unable to send feedback. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Send Feedback & Ideas
            </span>
          </div>
        </div>
      }
      description="Help us build the ultimate career operating platform. Every message is reviewed directly."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Creator Direct Delivery Trust Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail size={14} />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Direct Email Dispatch
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Dispatches immediately to{" "}
                <strong className="text-blue-600 dark:text-cyan-400">
                  poojadaki09@gmail.com
                </strong>
              </span>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={11} /> Verified Inbox
          </span>
        </div>

        {/* Feedback Type Selector Cards */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
            Select Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {FEEDBACK_TYPES.map((ft) => {
              const Icon = ft.icon;
              const isSelected = type === ft.id;
              return (
                <button
                  key={ft.id}
                  type="button"
                  onClick={() => setType(ft.id)}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? `${ft.activeBg} ${ft.activeBorder} shadow-sm ring-1 ring-offset-0 ring-current`
                      : "bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                      isSelected
                        ? "bg-white dark:bg-slate-900 shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    <Icon size={16} className={ft.iconColor} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black tracking-tight">{ft.label}</span>
                      {isSelected && (
                        <CheckCircle2 size={13} className="text-current shrink-0 ml-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                      {ft.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Quick Topic Tag:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* User Identity Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Your Name"
            placeholder="e.g. Alex Rivera"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            leftIcon={<User size={14} />}
          />
          <Input
            label="Your Email"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={14} />}
            helperText="We'll use this if we need to follow up with you."
          />
        </div>

        {/* Message Input with Character Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Your Message <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-[10px] font-mono font-bold ${
                message.length > 900
                  ? "text-rose-500"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {message.length}/1000
            </span>
          </div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
            rows={4}
            placeholder="Tell us what you love, what felt confusing, or what new tools you'd like to see in GetHired..."
            required
            className="text-xs sm:text-sm font-medium"
          />
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            ✨ Feedback is delivered instantaneously
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Send size={13} />}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25"
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
