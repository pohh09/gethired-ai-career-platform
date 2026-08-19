import { useState } from "react";
import toast from "react-hot-toast";
import {
  Link as LinkIcon,
  FileText,
  Edit3,
  Sparkles,
  Loader2,
  CheckCircle2,
  Globe,
  Building,
  Briefcase,
  MapPin,
  DollarSign,
} from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { extractJobDataFromUrlOrText } from "../../services/jobSearchService";
import type { CreateJobRequest } from "../../types/job";

export interface ImportJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jobData: CreateJobRequest) => void;
  isSubmitting?: boolean;
}

type ImportTab = "url" | "text" | "manual";

export default function ImportJobModal({
  isOpen,
  onClose,
  onImport,
  isSubmitting = false,
}: ImportJobModalProps) {
  const [activeTab, setActiveTab] = useState<ImportTab>("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSuccess, setExtractedSuccess] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("Remote");
  const [salary, setSalary] = useState<string>("");
  const [workplaceType, setWorkplaceType] = useState("Remote");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [jobLink, setJobLink] = useState("");
  const [status, setStatus] = useState("Applied");
  const [priority, setPriority] = useState("High");
  const [notes, setNotes] = useState("");

  const handleReset = () => {
    setUrlInput("");
    setTextInput("");
    setIsExtracting(false);
    setExtractedSuccess(false);
    setCompany("");
    setRole("");
    setLocation("Remote");
    setSalary("");
    setWorkplaceType("Remote");
    setEmploymentType("Full-time");
    setJobLink("");
    setStatus("Applied");
    setPriority("High");
    setNotes("");
  };

  const handleCloseModal = () => {
    handleReset();
    onClose();
  };

  const handleExtract = async () => {
    if (activeTab === "url" && !urlInput.trim()) {
      toast.error("Please paste a valid job URL.");
      return;
    }
    if (activeTab === "text" && !textInput.trim()) {
      toast.error("Please paste job description text.");
      return;
    }

    setIsExtracting(true);
    setExtractedSuccess(false);

    try {
      const data = await extractJobDataFromUrlOrText({
        url: activeTab === "url" ? urlInput.trim() : undefined,
        text: activeTab === "text" ? textInput.trim() : undefined,
      });

      if (data) {
        setCompany(data.company || "");
        setRole(data.role || "");
        setLocation(data.location || "Remote");
        setWorkplaceType(data.workplaceType || "Remote");
        setEmploymentType(data.employmentType || "Full-time");
        if (data.salary) setSalary(String(data.salary));
        setJobLink(data.jobLink || urlInput || "");
        setNotes(data.description || textInput || "");

        setExtractedSuccess(true);
        toast.success("Job details extracted automatically with AI!");
      }
    } catch (_err) {
      toast.error(
        "Extraction encountered an error. Please fill out details manually.",
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim() || !role.trim()) {
      toast.error("Company name and Job Role are required.");
      return;
    }

    onImport({
      company: company.trim(),
      role: role.trim(),
      location: location.trim() || "Remote",
      salary: salary ? Number(salary) : null,
      status,
      priority,
      jobLink: jobLink.trim(),
      notes: notes.trim(),
      appliedDate: new Date().toISOString().split("T")[0],
    });

    handleCloseModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Import Job Opportunity
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Extract from URL, paste description, or enter manually.
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "url"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/60 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
          >
            <LinkIcon size={14} />
            <span>Job URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "text"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/60 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
          >
            <FileText size={14} />
            <span>Description</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "manual"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/60 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
          >
            <Edit3 size={14} />
            <span>Manual</span>
          </button>
        </div>

        {activeTab === "url" && (
          <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Paste Job URL (LinkedIn, Greenhouse, Lever, Workday, Company
              career pages)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Globe
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="url"
                  placeholder="https://linkedin.com/jobs/view/... or https://boards.greenhouse.io/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleExtract}
                isLoading={isExtracting}
                disabled={isExtracting}
                leftIcon={
                  isExtracting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )
                }
              >
                Extract
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Supported portals: LinkedIn, Greenhouse, Lever, Indeed, Workday,
              and any public career URL.
            </p>
          </div>
        )}

        {activeTab === "text" && (
          <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Paste Complete Job Posting Description
            </label>
            <textarea
              rows={4}
              placeholder="Paste full job description text here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-3 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-y"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleExtract}
                isLoading={isExtracting}
                disabled={isExtracting}
                leftIcon={
                  isExtracting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )
                }
              >
                Extract Job Details
              </Button>
            </div>
          </div>
        )}

        {extractedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>
                Job details extracted automatically! You can review or edit
                below.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
            Job Details (Verify & Edit)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Name *
              </label>
              <div className="relative">
                <Building
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Google, Vercel"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Job Role / Title *
              </label>
              <div className="relative">
                <Briefcase
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Salary ($/yr)
              </label>
              <div className="relative">
                <DollarSign
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 165000"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Workplace Type
              </label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full py-2 px-3 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full py-2 px-3 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tracking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full py-2 px-3 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Assessment">Assessment</option>
                <option value="Offer">Offer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full py-2 px-3 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Original Job Link
            </label>
            <Input
              type="url"
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Job Description / Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Job posting notes, key requirements, team details..."
              className="w-full p-3 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 size={16} />}
            >
              Import & Save Application
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
