import React, { useState } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import { useJobs } from "../../hooks/useJobs";

export interface ResumeUploadProps {
  onAnalyze: (resumeText: string, jobDescription?: string) => void;
  isLoading?: boolean;
  className?: string;
}

export default function ResumeUpload({
  onAnalyze,
  isLoading = false,
  className = "",
}: ResumeUploadProps) {
  const [resumeText, setResumeText] = useState<string>(
    "Senior Product Engineer with 5+ years experience building web apps with React, TypeScript, Node.js, REST APIs, Tailwind CSS, and state management tools."
  );
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [customJd, setCustomJd] = useState<string>("");

  const { data: jobsData } = useJobs({ limit: 50 });
  const jobs = jobsData?.data || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit. Please upload a smaller file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setResumeText(text);
          toast.success(`Loaded ${file.name}`);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read file. Please paste your text manually.");
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      toast.error("Please enter or upload your resume content.");
      return;
    }

    let finalJd = customJd;
    if (selectedJobId) {
      const foundJob = jobs.find((j) => j._id === selectedJobId);
      if (foundJob) {
        finalJd = `${foundJob.role} at ${foundJob.company}\nLocation: ${foundJob.location || "Remote"}\nNotes: ${foundJob.notes || ""}`;
      }
    }

    onAnalyze(resumeText, finalJd);
  };

  return (
    <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 shadow-sm space-y-6 ${className}`}>
      <div className="space-y-1.5">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-500" />
          <span>AI Resume Optimizer</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload or paste your resume content below to receive instant ATS scores, keyword gaps, and tailored rewrite suggestions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText size={14} />
              <span>Resume Content</span>
            </label>

            <label className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-200/50">
              <Upload size={13} />
              <span>Upload PDF / DOCX</span>
              <input
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <Textarea
            rows={6}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your work experience, education, and technical skills resume text..."
          />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <Select
              label="Optional Target Job Application"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              options={[
                { label: "None (General Industry Optimization)", value: "" },
                ...jobs.map((j) => ({
                  label: `${j.company} — ${j.role}`,
                  value: j._id,
                })),
              ]}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Or Custom Job Description
            </label>
            <input
              type="text"
              value={customJd}
              onChange={(e) => setCustomJd(e.target.value)}
              disabled={Boolean(selectedJobId)}
              placeholder="e.g. Senior Frontend Developer with Next.js & GraphQL"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-slate-100 disabled:opacity-50"
            />
          </div>
        </div>


        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            leftIcon={<Sparkles size={18} />}
          >
            Optimize Resume with AI
          </Button>
        </div>
      </form>
    </div>
  );
}
