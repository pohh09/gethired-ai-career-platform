import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import CoverLetterGenerator from "../components/coverLetter/CoverLetterGenerator";
import Select from "../components/ui/Select";
import { Briefcase } from "lucide-react";
import { useJobs } from "../hooks/useJobs";
import type { Job } from "../types/job";

export default function AiCoverLetter() {
  const { data: jobsData } = useJobs({ limit: 100 });
  const jobs: Job[] = jobsData?.data || [];

  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const selectedJob = jobs.find((j) => j._id === selectedJobId) || null;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="AI Cover Letter Generator"
        subtitle="Generate executive, highly tailored cover letters for any saved job application in under 30 seconds."
      />

      {jobs.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold shrink-0 border border-blue-100 dark:border-blue-900/50">
              <Briefcase size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Select a Saved Job Application
              </h4>
              <p className="text-xs text-slate-500">
                Auto-fill company name, role title, and job notes automatically.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <Select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              options={[
                { label: "Custom / Blank Target", value: "" },
                ...jobs.map((j) => ({
                  label: `${j.company} - ${j.role}`,
                  value: j._id,
                })),
              ]}
            />
          </div>
        </div>
      )}

      <CoverLetterGenerator
        key={selectedJobId || "custom"}
        initialJob={selectedJob}
      />
    </div>
  );
}
