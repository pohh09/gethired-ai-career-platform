import React, { useState } from "react";
import {
  Share2,
  FileText,
  Briefcase,
  Lock,
  Globe,
} from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useCommunityStore } from "../../store/communityStore";
import { useResumeStore } from "../../store/resumeStore";
import { useDocumentStore } from "../../store/documentStore";
import toast from "react-hot-toast";

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "resume" | "cover_letter";
}

export default function ShareDocumentModal({
  isOpen,
  onClose,
  defaultType = "resume",
}: ShareDocumentModalProps) {
  const { shareDocument } = useCommunityStore();
  const { resumes } = useResumeStore();
  const { documents } = useDocumentStore();

  const [documentType, setDocumentType] = useState<"resume" | "cover_letter">(
    defaultType
  );
  const [selectedSourceId, setSelectedSourceId] = useState<string>("custom");
  const [title, setTitle] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"shared" | "private">("private");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync content when choosing from existing store
  const handleSelectSource = (sourceId: string) => {
    setSelectedSourceId(sourceId);
    if (sourceId === "custom") return;

    if (documentType === "resume") {
      const res = resumes.find((r) => r.id === sourceId);
      if (res) {
        setTitle(res.name);
        setContent(res.content);
        setTargetRole("Software Engineer");
      }
    } else {
      const doc = documents.find((d) => d.id === sourceId);
      if (doc) {
        setTitle(doc.title);
        setContent(doc.content);
        setTargetRole(doc.role || "");
        setTargetCompany(doc.company || "");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter a title and document content.");
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await shareDocument({
        title: title.trim(),
        documentType,
        targetRole: targetRole.trim() || "Candidate",
        targetCompany: targetCompany.trim(),
        content: content.trim(),
        visibility,
        tags: tags.length > 0 ? tags : ["Peer Review"],
      });

      toast.success(
        visibility === "shared"
          ? "Document published to Community Peer Review! 🚀"
          : "Saved as private draft."
      );
      onClose();
    } catch {
      toast.error("Failed to save document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" title="Share Draft for Peer Review">
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Save your resume or cover letter draft. By default, drafts stay private to you unless you opt in to open them for community feedback.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Document Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setDocumentType("resume");
                  setSelectedSourceId("custom");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  documentType === "resume"
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <FileText size={14} />
                <span>Resume</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDocumentType("cover_letter");
                  setSelectedSourceId("custom");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  documentType === "cover_letter"
                    ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <Briefcase size={14} />
                <span>Cover Letter</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Import from Saved Items
            </label>
            <select
              value={selectedSourceId}
              onChange={(e) => handleSelectSource(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium outline-hidden"
            >
              <option value="custom">-- Paste / Write New --</option>
              {documentType === "resume"
                ? resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.fileType.toUpperCase()})
                    </option>
                  ))
                : documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Document Title"
            placeholder="e.g. Senior Frontend Resume 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Target Role"
            placeholder="e.g. Staff Full Stack Engineer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Target Company (Optional)"
            placeholder="e.g. Stripe, Airbnb, Google"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
          />

          <Input
            label="Tags (Comma separated)"
            placeholder="e.g. React, FinTech, SystemDesign"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Draft Text Content
            </label>
            <span className="text-[11px] text-slate-400">
              {content.length} characters
            </span>
          </div>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your resume or cover letter draft text here..."
            required
            className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        {/* Privacy & Visibility Toggle */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              {visibility === "shared" ? (
                <>
                  <Globe size={14} className="text-emerald-500" />
                  <span>Open for Community Feedback (Public)</span>
                </>
              ) : (
                <>
                  <Lock size={14} className="text-slate-400" />
                  <span>Private Only (Default)</span>
                </>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">
              {visibility === "shared"
                ? "Other GetHired members can read and leave helpful section comments."
                : "Kept private to your account only. Toggle to opt into peer reviews."}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setVisibility(visibility === "shared" ? "private" : "shared")
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer shrink-0 ${
              visibility === "shared"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600"
            }`}
          >
            {visibility === "shared" ? "Public / Shared" : "Make Public"}
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            className="font-bold flex items-center gap-1.5"
          >
            <Share2 size={14} />
            <span>{visibility === "shared" ? "Publish Draft" : "Save Draft"}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
