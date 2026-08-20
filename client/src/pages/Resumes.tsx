import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Upload,
  Star,
  Download,
  Trash2,
  Edit2,
  Eye,
  Check,
  Briefcase,
  FileCheck,
  Share2,
  Sparkles,
  FileText,
  MessageSquareShare,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import EmptyState from "../components/dashboard/EmptyState";
import ResumePreviewModal from "../components/resumes/ResumePreviewModal";
import ShareDocumentModal from "../components/community/ShareDocumentModal";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { useResumeStore, type ResumeItem } from "../store/resumeStore";
import { useCommunityStore } from "../store/communityStore";

export default function Resumes() {
  const { resumes, addResume, deleteResume, renameResume, setDefaultResume } =
    useResumeStore();
  const { sharedDocuments } = useCommunityStore();

  const [activeTab, setActiveTab] = useState<"resumes" | "shared">("resumes");
  const [previewResume, setPreviewResume] = useState<ResumeItem | null>(null);
  const [renamingResume, setRenamingResume] = useState<ResumeItem | null>(null);
  const [newName, setNewName] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const mySharedDocs = sharedDocuments.filter((d) => d.userId === "user-current");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const fileType = ext === "docx" ? "docx" : "pdf";
      const sizeKb = Math.round(file.size / 1024);
      const fileSize = `${sizeKb} KB`;

      const reader = new FileReader();
      reader.onload = (event) => {
        const text =
          (event.target?.result as string) ||
          `Content extracted from ${file.name}.\nCandidate Profile and Experience details.`;

        addResume({
          name: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          fileSize,
          fileType,
          content: text,
          isDefault: false,
        });

        toast.success(`Uploaded ${file.name}`);
      };
      reader.readAsText(file);
    });
  };

  const handleOpenRename = (resume: ResumeItem) => {
    setRenamingResume(resume);
    setNewName(resume.name);
  };

  const handleSaveRename = () => {
    if (!renamingResume || !newName.trim()) return;
    renameResume(renamingResume.id, newName.trim());
    toast.success("Resume renamed successfully!");
    setRenamingResume(null);
  };

  const handleDownload = (resume: ResumeItem) => {
    const blob = new Blob([resume.content], {
      type: "text/plain;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", resume.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${resume.fileName}`);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Resumes & Documents Hub"
        subtitle="Manage master resumes, launch guided AI builder, and monitor peer review drafts."
        action={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to="/resumes/builder"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-600/20"
            >
              <Sparkles size={15} />
              <span>Create New (AI Builder) ✨</span>
            </Link>

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all shadow-xs cursor-pointer">
              <Upload size={15} className="text-blue-600" />
              <span>Upload File</span>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        }
      />

      {/* Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("resumes")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeTab === "resumes"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <FileText size={15} />
          <span>Master Resumes</span>
          <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-white/20">
            {resumes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shared")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
            activeTab === "shared"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          }`}
        >
          <MessageSquareShare size={15} />
          <span>Shared for Peer Review</span>
          <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {mySharedDocs.length}
          </span>
        </button>
      </div>

      {activeTab === "shared" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <MessageSquareShare size={18} className="text-indigo-600" />
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                  Peer Review & Community Drafts
                </h4>
                <p className="text-[11px] text-slate-500">
                  Documents you have opened for peer feedback in the Community Hub.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              className="text-xs font-bold shrink-0"
              leftIcon={<Share2 size={13} />}
            >
              Share Another Draft
            </Button>
          </div>

          {mySharedDocs.length === 0 ? (
            <EmptyState
              title="No shared drafts yet"
              description="Share a resume or cover letter draft to the Community to get actionable suggestions and feedback from peers."
              actionText="Share Draft for Review"
              onAction={() => setIsShareModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySharedDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300">
                        {doc.documentType.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {doc.feedbackCount || doc.feedbackList.length} feedback comments
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      Target: {doc.targetRole} {doc.targetCompany ? `@ ${doc.targetCompany}` : ""}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl line-clamp-2">
                      {doc.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <Link
                      to="/community"
                      className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                    >
                      View in Community →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "resumes" && (
        <>
          {resumes.length > 0 && (
            <div className="p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/70 via-cyan-50/40 to-white dark:from-blue-950/40 dark:via-cyan-950/20 dark:to-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <Star size={20} />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-cyan-300 block">
                    Active Default Resume
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {resumes.find((r) => r.isDefault)?.name || resumes[0]?.name}
                  </h4>
                </div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                AI actions automatically analyze against your default resume unless
                overridden.
              </span>
            </div>
          )}

      {resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className={`p-5 rounded-2xl border bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                resume.isDefault
                  ? "border-blue-500/80 ring-2 ring-cyan-500/20 dark:border-blue-500"
                  : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs ${
                        resume.fileType === "pdf"
                          ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/50"
                          : "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50"
                      }`}
                    >
                      {resume.fileType.toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
                          {resume.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {resume.fileName}
                      </p>
                    </div>
                  </div>

                  {resume.isDefault && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200/50 shrink-0">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span>Size: {resume.fileSize}</span>
                  <span>Uploaded: {resume.uploadDate}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Briefcase size={14} className="text-blue-500 dark:text-cyan-400 shrink-0" />
                  <span>
                    Used in{" "}
                    <strong>{resume.usedInApplicationsCount || 4}</strong>{" "}
                    applications
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewResume(resume)}
                    leftIcon={<Eye size={14} />}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(resume)}
                    leftIcon={<Download size={14} />}
                  >
                    Download
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsShareModalOpen(true)}
                  leftIcon={<Share2 size={13} className="text-blue-500" />}
                  className="w-full text-xs font-bold border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                >
                  Share for Peer Review
                </Button>

                <div className="flex items-center justify-between pt-1">
                  {!resume.isDefault ? (
                    <button
                      type="button"
                      onClick={() => {
                        setDefaultResume(resume.id);
                        toast.success(
                          `Set "${resume.name}" as default resume.`,
                        );
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Star size={13} />
                      <span>Make Default</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check size={13} />
                      <span>Active Default</span>
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenRename(resume)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title="Rename resume"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteResume(resume.id);
                        toast.success(`Deleted ${resume.name}`);
                      }}
                      className="p-1 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                      title="Delete resume"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No resumes uploaded yet"
          description="Upload your master resume files (PDF or DOCX) to power AI Resume Matching, ATS Optimization, and Cover Letter generation."
          actionText="Upload Resume Now"
          icon={<FileCheck size={38} className="animate-bounce" />}
          onAction={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".pdf,.doc,.docx,.txt";
            input.onchange = (e: Event) =>
              handleFileUpload(
                e as unknown as React.ChangeEvent<HTMLInputElement>,
              );
            input.click();
          }}
        />
      )}
      </>
    )}

      <ResumePreviewModal
        isOpen={!!previewResume}
        onClose={() => setPreviewResume(null)}
        resume={previewResume}
        onMakeDefault={setDefaultResume}
      />

      <ShareDocumentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        defaultType="resume"
      />

      {renamingResume && (
        <Modal
          isOpen={!!renamingResume}
          onClose={() => setRenamingResume(null)}
          title="Rename Resume"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <Input
              label="Resume Title"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Senior Fullstack Resume 2026"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setRenamingResume(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveRename}>
                Save Name
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
