import { useState, useEffect } from "react";
import { Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import PromptOptions from "./PromptOptions";
import GeneratedLetter from "./GeneratedLetter";
import VersionHistory from "./VersionHistory";
import ActionToolbar from "./ActionToolbar";
import CoverLetterSkeleton from "./CoverLetterSkeleton";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import { fetchCoverLetter } from "../../services/coverLetterService";
import { useAuthStore } from "../../store/authStore";
import type { Job } from "../../types/job";
import type {
  CoverLetterStyle,
  ExperienceLevel,
  CoverLetterLength,
  CoverLetterResult,
  CoverLetterVersion,
} from "../../types/coverLetter";

export interface CoverLetterGeneratorProps {
  initialJob?: Job | null;
  onSaveToJobNotes?: (jobId: string, coverLetterText: string) => void;
  className?: string;
}

export default function CoverLetterGenerator({
  initialJob = null,
  onSaveToJobNotes,
  className = "",
}: CoverLetterGeneratorProps) {
  const { user } = useAuthStore();

  const [company, setCompany] = useState<string>(initialJob?.company || "");
  const [role, setRole] = useState<string>(initialJob?.role || "");
  const [jobDescription, setJobDescription] = useState<string>(
    initialJob?.notes || "",
  );
  const [resumeText, setResumeText] = useState<string>("");
  const [showAdvancedInputs, setShowAdvancedInputs] = useState<boolean>(false);

  const [style, setStyle] = useState<CoverLetterStyle>("Professional");
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>("Senior");
  const [length, setLength] = useState<CoverLetterLength>("Medium");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [versions, setVersions] = useState<CoverLetterVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState<string>("");

  useEffect(() => {
    if (initialJob) {
      setCompany(initialJob.company);
      setRole(initialJob.role);
      setJobDescription(initialJob.notes || "");
    }
  }, [initialJob]);

  useEffect(() => {
    const savedResume = localStorage.getItem("jobflow_user_resume_text");
    if (savedResume) {
      setResumeText(savedResume);
    }
  }, []);

  const handleGenerate = async () => {
    if (!company.trim()) {
      toast.error("Please enter a company name.");
      return;
    }
    if (!role.trim()) {
      toast.error("Please enter a job title / role.");
      return;
    }

    setIsLoading(true);
    setError(null);

    if (resumeText.trim()) {
      localStorage.setItem("jobflow_user_resume_text", resumeText.trim());
    }

    try {
      const response = await fetchCoverLetter({
        company: company.trim(),
        role: role.trim(),
        jobDescription: jobDescription.trim(),
        resumeText: resumeText.trim(),
        style,
        experienceLevel,
        length,
        userName: user?.name,
        userEmail: user?.email,
      });

      if (response.success && response.data) {
        setResult(response.data);
        setEditedText(response.data.coverLetterText);

        const newVersion: CoverLetterVersion = {
          id: `v-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          style,
          experienceLevel,
          length,
          coverLetterText: response.data.coverLetterText,
        };

        setVersions((prev) => [newVersion, ...prev]);
        setActiveVersionId(newVersion.id);
        toast.success("AI Cover Letter generated in < 30s!");
      } else {
        setError(
          response.message ||
          "Failed to generate cover letter. Please try again.",
        );
        toast.error("Generation failed.");
      }
    } catch (_err) {
      setError("Network or API error occurred while connecting to AI backend.");
      toast.error("Service connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVersion = (v: CoverLetterVersion) => {
    setActiveVersionId(v.id);
    setEditedText(v.coverLetterText);
    setStyle(v.style);
    setExperienceLevel(v.experienceLevel);
    setLength(v.length);
  };

  const handleCopy = () => {
    if (!editedText) return;
    navigator.clipboard.writeText(editedText);
    toast.success("Cover letter copied to clipboard!");
  };

  const handleSaveToJob = () => {
    if (!editedText) return;
    if (initialJob && onSaveToJobNotes) {
      onSaveToJobNotes(initialJob._id, editedText);
    } else {
      toast.success("Cover letter saved to session!");
    }
  };

  const isMissingResume = !resumeText.trim();
  const isMissingJd = !jobDescription.trim();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Application & Target Details
              </h3>
              <p className="text-xs text-slate-500">
                Auto-fills from your saved job application & candidate profile.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedInputs((prev) => !prev)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {showAdvancedInputs
              ? "Hide Resume & JD Inputs"
              : "Customize Resume / JD"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            placeholder="e.g. Google, Stripe, Acme Corp"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <Input
            label="Target Job Title / Role"
            placeholder="e.g. Senior Software Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        {showAdvancedInputs && (
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Job Description / Key Requirements
              </label>
              <Textarea
                rows={3}
                placeholder="Paste key responsibilities or job description text here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Candidate Resume Summary / Skills (Optional)
              </label>
              <Textarea
                rows={3}
                placeholder="Paste key achievements or resume bullets here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
          </div>
        )}

        {(isMissingResume || isMissingJd) && !showAdvancedInputs && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-amber-500 shrink-0" />
              <span>
                {isMissingResume && isMissingJd
                  ? "No resume or job description attached. Generating using candidate profile standards."
                  : isMissingResume
                    ? "No custom resume uploaded. Using user profile default engineering skills."
                    : "No detailed job description attached. Using general role responsibilities."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAdvancedInputs(true)}
              className="font-bold underline text-amber-900 dark:text-amber-100 hover:opacity-80 shrink-0"
            >
              Add Resume / JD
            </button>
          </div>
        )}
      </div>

      <PromptOptions
        style={style}
        experienceLevel={experienceLevel}
        length={length}
        onChangeStyle={setStyle}
        onChangeExperience={setExperienceLevel}
        onChangeLength={setLength}
      />

      {!result && !isLoading && !error && (
        <div className="text-center pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            leftIcon={<Sparkles size={18} />}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 shadow-md transition-all hover:scale-[1.01]"
          >
            Generate AI Cover Letter (&lt; 30s)
          </Button>
        </div>
      )}


      {isLoading && <CoverLetterSkeleton />}


      {error && !isLoading && (
        <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 space-y-3 text-center">
          <AlertCircle size={24} className="mx-auto text-rose-500" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm">
              Cover Letter Generation Failed
            </h4>
            <p className="text-xs opacity-90">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            leftIcon={<RotateCcw size={14} />}
            className="border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60"
          >
            Retry Request
          </Button>
        </div>
      )}

      {result && !isLoading && (
        <div className="space-y-6 pt-2">
          <VersionHistory
            versions={versions}
            activeVersionId={activeVersionId}
            onSelectVersion={handleSelectVersion}
          />

          <GeneratedLetter
            letterText={editedText}
            onChangeText={setEditedText}
            highlightedSkills={result.highlightedSkills}
            keywordsUsed={result.keywordsUsed}
            atsTips={result.atsTips}
          />

          <ActionToolbar
            company={company}
            role={role}
            letterText={editedText}
            onCopy={handleCopy}
            onSaveToJob={handleSaveToJob}
            onRegenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
