import { useState } from "react";
import { Send, Bug, Lightbulb, HelpCircle, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import api from "../../services/api";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEEDBACK_TYPES = [
  { id: "suggestion", label: "Feature Suggestion", icon: Lightbulb, color: "text-amber-500" },
  { id: "bug", label: "Bug Report", icon: Bug, color: "text-rose-500" },
  { id: "question", label: "Question", icon: HelpCircle, color: "text-blue-500" },
  { id: "other", label: "General Feedback", icon: MessageCircle, color: "text-purple-500" },
];

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [type, setType] = useState<string>("suggestion");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter your feedback message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/feedback", {
        type,
        message: message.trim(),
        pageUrl: window.location.pathname,
      });

      toast.success("Thank you! Your feedback has been sent directly to the engineering team. 🚀");
      setMessage("");
      onClose();
    } catch {
      // In offline/demo mode, save to localStorage so nothing is lost
      try {
        const saved = JSON.parse(localStorage.getItem("gethired_local_feedback") || "[]");
        saved.push({ type, message: message.trim(), date: new Date().toISOString() });
        localStorage.setItem("gethired_local_feedback", JSON.stringify(saved));
      } catch (_e) {}
      toast.success("Thank you! Your feedback has been recorded. 🚀");
      setMessage("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Feedback & Suggestions" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Feedback Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FEEDBACK_TYPES.map((ft) => {
              const Icon = ft.icon;
              const isSelected = type === ft.id;
              return (
                <button
                  key={ft.id}
                  type="button"
                  onClick={() => setType(ft.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={15} className={ft.color} />
                  <span>{ft.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          label="Your Feedback / Report"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Describe what you'd like improved, any bugs encountered, or ideas for new career tools..."
          required
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
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
