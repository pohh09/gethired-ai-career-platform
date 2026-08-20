import React, { useState } from "react";
import {
  X,
  MessageSquare,
  ThumbsUp,
  Send,
  FileText,
  Briefcase,
  Sparkles,
  Lock,
  Globe,
} from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import type {
  SharedDocumentItem,
  DocumentSection,
} from "../../types/community";
import { useCommunityStore } from "../../store/communityStore";
import toast from "react-hot-toast";

interface PeerReviewModalProps {
  document: SharedDocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS: DocumentSection[] = [
  "General",
  "Summary / Intro",
  "Work Experience",
  "Skills & Tech Stack",
  "Education & Certs",
  "Formatting & Tone",
];

export default function PeerReviewModal({
  document,
  isOpen,
  onClose,
}: PeerReviewModalProps) {
  const { addFeedbackToDoc, toggleFeedbackVote, toggleDocVisibility } =
    useCommunityStore();

  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>("All");
  const [targetSection, setTargetSection] = useState<DocumentSection>("General");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!document) return null;

  const filteredFeedbacks =
    selectedSectionFilter === "All"
      ? document.feedbackList
      : document.feedbackList.filter(
          (fb) => fb.targetSection === selectedSectionFilter
        );

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Please enter a constructive feedback suggestion.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addFeedbackToDoc(document._id, commentText.trim(), targetSection);
      toast.success("Feedback posted! +1 Streak activity logged 🔥");
      setCommentText("");
    } catch {
      toast.error("Failed to post feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePrivacy = async () => {
    await toggleDocVisibility(document._id);
    toast.success(
      document.visibility === "shared"
        ? "Document set to Private"
        : "Document is now Open for Peer Feedback 🚀"
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="flex flex-col h-[85vh] max-h-[850px] -m-6 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={document.documentType === "resume" ? "primary" : "purple"}
                className="text-[11px] font-bold uppercase tracking-wider"
              >
                {document.documentType === "resume" ? "Resume Draft" : "Cover Letter"}
              </Badge>

              <button
                type="button"
                onClick={handleTogglePrivacy}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  document.visibility === "shared"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                }`}
                title="Click to toggle visibility"
              >
                {document.visibility === "shared" ? (
                  <>
                    <Globe size={12} className="text-emerald-500" />
                    <span>Open for Feedback</span>
                  </>
                ) : (
                  <>
                    <Lock size={12} className="text-slate-400" />
                    <span>Private Draft</span>
                  </>
                )}
              </button>

              <span className="text-xs text-slate-400">
                by <strong className="text-slate-700 dark:text-slate-200">{document.authorName}</strong>
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold truncate text-slate-900 dark:text-slate-100">
              {document.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              {document.targetRole && (
                <span className="flex items-center gap-1">
                  <Briefcase size={13} className="text-blue-500" />
                  Target: <strong>{document.targetRole}</strong>
                  {document.targetCompany ? ` @ ${document.targetCompany}` : ""}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Two-Column Review Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: Document Content Preview */}
          <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText size={14} className="text-blue-500" />
                Draft Document
              </span>

              {document.tags && document.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {document.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-100 dark:border-blue-900/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs font-mono text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap select-text text-slate-800 dark:text-slate-200 overflow-x-auto">
              {document.content}
            </div>
          </div>

          {/* Right Column: Feedback List & Submission Form */}
          <div className="lg:col-span-5 flex flex-col h-full bg-white dark:bg-slate-900 min-h-0">
            {/* Feedback Filters */}
            <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <MessageSquare size={15} className="text-indigo-500" />
                <span>Peer Feedback ({document.feedbackList.length})</span>
              </div>

              <select
                value={selectedSectionFilter}
                onChange={(e) => setSelectedSectionFilter(e.target.value)}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium outline-hidden"
              >
                <option value="All">All Sections</option>
                {SECTIONS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Comments List */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 min-h-0">
              {filteredFeedbacks.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 mx-auto flex items-center justify-center border border-indigo-200/50">
                    <Sparkles size={22} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      No feedback in this section yet
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Be the first to review and suggest helpful improvements!
                    </p>
                  </div>
                </div>
              ) : (
                filteredFeedbacks.map((fb) => {
                  const hasUpvoted = fb.upvotes?.includes("user-current");
                  return (
                    <div
                      key={fb._id}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            {fb.authorName.charAt(0)}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {fb.authorName}
                          </span>
                        </div>

                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200/40 shrink-0">
                          {fb.targetSection}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {fb.comment}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                        <span>
                          {new Date(fb.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleFeedbackVote(document._id, fb._id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            hasUpvoted
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <ThumbsUp size={12} className={hasUpvoted ? "fill-white" : ""} />
                          <span>{fb.upvoteCount || 0} Helpful</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Feedback Input Form */}
            <form
              onSubmit={handleSubmitFeedback}
              className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-2.5 shrink-0"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Leave Peer Feedback
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">Target:</span>
                  <select
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value as DocumentSection)}
                    className="text-xs px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium outline-hidden"
                  >
                    {SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`Suggest improvement for ${targetSection}...`}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-500" />
                  Constructive feedback earns you streak points!
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  className="text-xs px-3.5 py-1.5 font-bold"
                >
                  <Send size={13} />
                  <span>Post Feedback</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
