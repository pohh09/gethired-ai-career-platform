import { useState, useEffect } from "react";
import { Send, Bug, Lightbulb, HelpCircle, MessageSquare, Mail, User } from "lucide-react";
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

  useEffect(() => {
    if (user?.name && !authorName) setAuthorName(user.name);
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

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
          response.data.message || "Thank you! Your feedback has been sent.",
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
      title="Send Feedback"
      description="Help us make GetHired better. We read and appreciate every submission."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
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
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${isSelected
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
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
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
      </form>
    </Modal>
  );
}
