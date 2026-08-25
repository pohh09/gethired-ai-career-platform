import { useState, useEffect } from "react";
import { Send, Bug, Lightbulb, HelpCircle, MessageSquare, Mail, User, AlertCircle } from "lucide-react";
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

const FEEDBACK_CATEGORIES = [
  { id: "suggestion", label: "Idea", icon: Lightbulb, color: "text-amber-500" },
  { id: "bug", label: "Bug Report", icon: Bug, color: "text-rose-500" },
  { id: "question", label: "Question", icon: HelpCircle, color: "text-blue-500 dark:text-cyan-400" },
  { id: "other", label: "General", icon: MessageSquare, color: "text-purple-500" },
];

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useAuthStore();
  const [type, setType] = useState<string>("suggestion");
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  useEffect(() => {
    if (user?.name && !authorName) setAuthorName(user.name);
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

  const handleOpenMailClient = () => {
    const categoryLabel = FEEDBACK_CATEGORIES.find((c) => c.id === type)?.label || "Feedback";
    const subject = encodeURIComponent(`[GetHired ${categoryLabel}] from ${authorName.trim() || user?.name || "User"}`);
    const bodyContent = `Category: ${categoryLabel}
From: ${authorName.trim() || user?.name || "Anonymous"} (${email.trim() || user?.email || "No email provided"})
Page URL: ${window.location.href}

Message:
${message.trim() || "(Write your feedback here...)"}
`;
    const body = encodeURIComponent(bodyContent);
    window.location.href = `mailto:poojadaki09@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter your feedback message.");
      return;
    }

    setIsSubmitting(true);
    setSubmitFailed(false);

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
          response.data.message || "Thank you! Your feedback has been sent.",
        );
        setMessage("");
        setType("suggestion");
        setSubmitFailed(false);
        onClose();
      } else {
        setSubmitFailed(true);
        toast.error("Unable to submit feedback. You can email us directly.");
      }
    } catch (err: any) {
      setSubmitFailed(true);
      const errorMsg =
        err.response?.data?.message || "Unable to send feedback. You can email us directly.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Feedback"
      description="Help us make GetHired better. We read and appreciate every submission."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Fallback Banner if Submission Failed */}
        {submitFailed && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <AlertCircle size={15} className="shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Submission issue? Send directly using your email app.</span>
            </div>
            <button
              type="button"
              onClick={handleOpenMailClient}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              <Mail size={13} />
              <span>Send via Email App</span>
            </button>
          </div>
        )}

        {/* Simple Category Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Feedback Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FEEDBACK_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = type === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setType(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-cyan-300 shadow-xs ring-1 ring-blue-500/30"
                      : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon size={14} className={cat.color} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Identity Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Name (Optional)"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            leftIcon={<User size={14} />}
          />
          <Input
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={14} />}
          />
        </div>

        {/* Message Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Message <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              {message.length}/1000
            </span>
          </div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
            rows={4}
            placeholder="What's on your mind? Share any ideas, questions, or issues you encountered..."
            required
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleOpenMailClient}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 cursor-pointer transition-colors"
            title="Send feedback using your default email application"
          >
            <Mail size={13} />
            <span>Email directly instead</span>
          </button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Send size={13} />}
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
