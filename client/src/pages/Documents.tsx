import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  FileText,
  Search,
  Copy,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import EmptyState from "../components/dashboard/EmptyState";
import Modal from "../components/ui/Modal";
import FilterDropdown, {
  type FilterOption,
} from "../components/jobs/FilterDropdown";
import {
  useDocumentStore,
  type AIDocumentItem,
  type AIDocumentCategory,
} from "../store/documentStore";

const CATEGORY_OPTIONS: FilterOption[] = [
  { label: "All Document Categories", value: "All" },
  { label: "Cover Letter", value: "Cover Letter" },
  { label: "Resume Analysis", value: "Resume Analysis" },
  { label: "Resume Optimization", value: "Resume Optimization" },
  { label: "Interview Prep", value: "Interview Prep" },
  { label: "Job Analysis", value: "Job Analysis" },
  { label: "Career Coach", value: "Career Coach" },
];

export default function Documents() {
  const { documents, deleteDocument, updateDocumentContent } =
    useDocumentStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewingDoc, setViewingDoc] = useState<AIDocumentItem | null>(null);

  const filteredDocuments = useMemo(() => {
    let result = [...documents];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.company || "").toLowerCase().includes(q) ||
          (d.role || "").toLowerCase().includes(q) ||
          d.content.toLowerCase().includes(q),
      );
    }

    if (category !== "All") {
      result = result.filter((d) => d.category === category);
    }

    return result;
  }, [documents, search, category]);

  const handleCopy = (doc: AIDocumentItem) => {
    navigator.clipboard.writeText(doc.content);
    toast.success("Document content copied to clipboard!");
  };

  const handleDownload = (doc: AIDocumentItem) => {
    const filename = `${doc.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    const blob = new Blob([doc.content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${filename}`);
  };

  const handleRegenerate = (doc: AIDocumentItem) => {
    const regenerated = `${doc.content}\n\n[Regenerated with AI update on ${new Date().toLocaleDateString()}]`;
    updateDocumentContent(doc.id, regenerated);
    toast.success(`Regenerated content for "${doc.title}"!`);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="AI Documents Repository"
        subtitle="Access, search, copy, download, and manage all your AI-generated career materials in one place."
        badge={
          <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200/60 dark:border-blue-800/60 shadow-xs">
            {documents.length} Saved{" "}
            {documents.length === 1 ? "Document" : "Documents"}
          </span>
        }
      />

      <div className="space-y-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search document title, company, or content..."
              className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-blue-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <FilterDropdown
            label="Category"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(val) => setCategory(val as AIDocumentCategory | "All")}
          />

          {(search || category !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs flex flex-col justify-between space-y-4 hover:border-sky-300 dark:hover:border-sky-800/80 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50">
                      <Sparkles size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200/50 inline-block mb-1">
                        {doc.category}
                      </span>
                      <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
                        {doc.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {doc.content}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Created {doc.createdAt}</span>
                  {doc.company && <span>{doc.company}</span>}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingDoc(doc)}
                  leftIcon={<Eye size={13} />}
                  className="text-xs font-bold px-2"
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(doc)}
                  leftIcon={<Copy size={13} />}
                  className="text-xs font-bold px-2"
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  leftIcon={<Download size={13} />}
                  className="text-xs font-bold px-2"
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    deleteDocument(doc.id);
                    toast.success(`Deleted document "${doc.title}"`);
                  }}
                  leftIcon={<Trash2 size={13} />}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No AI documents found"
          description="Use AI Cover Letter, Resume Match, Resume Optimizer, or Interview Prep tools across GetHired to automatically generate and save documents here."
        />
      )}

      {viewingDoc && (
        <Modal
          isOpen={!!viewingDoc}
          onClose={() => setViewingDoc(null)}
          title={
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold border border-blue-200/50">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {viewingDoc.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Category: {viewingDoc.category} • Saved on{" "}
                  {viewingDoc.createdAt}
                </p>
              </div>
            </div>
          }
          maxWidth="2xl"
        >
          <div className="space-y-5">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto scrollbar-thin">
              {viewingDoc.content}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRegenerate(viewingDoc)}
                leftIcon={<RefreshCw size={14} />}
              >
                Regenerate Document
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(viewingDoc)}
                  leftIcon={<Copy size={14} />}
                >
                  Copy Text
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(viewingDoc)}
                  leftIcon={<Download size={14} />}
                >
                  Download
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setViewingDoc(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
