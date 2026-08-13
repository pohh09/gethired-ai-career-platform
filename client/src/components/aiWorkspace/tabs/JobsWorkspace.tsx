import { useState } from "react";
import {
  Briefcase,
  Sparkles,
  DollarSign,
  Building2,
  Copy,
  Target,
  Mail,
  FileText,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import Input from "../../ui/Input";
import { useResumeStore } from "../../../store/resumeStore";
import * as aiService from "../../../services/aiWorkspaceService";

export default function JobsWorkspace() {
  const { activeResumeText, activeResumeFileName } = useResumeStore();

  const [companyName, setCompanyName] = useState("Razorpay");
  const [targetRole, setTargetRole] = useState("Senior Full Stack Developer");
  const [location, setLocation] = useState("Bangalore, India");
  const [jobDescription, setJobDescription] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<
    "jd" | "explain" | "match" | "cover-letter" | "followup" | "salary" | "company" | null
  >(null);

  const [jdData, setJdData] = useState<any>(null);
  const [explainData, setExplainData] = useState<any>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const [coverLetterData, setCoverLetterData] = useState<any>(null);
  const [followUpData, setFollowUpData] = useState<any>(null);
  const [salaryData, setSalaryData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);

  const handleAnalyzeJD = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description to analyze");
      return;
    }
    setIsProcessing(true);
    setActiveWorkflow("jd");
    try {
      const data = await aiService.analyzeJobDescription(jobDescription);
      setJdData(data);
      toast.success("Job Description analyzed successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to analyze job description");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExplainJob = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first");
      return;
    }
    setIsProcessing(true);
    setActiveWorkflow("explain");
    try {
      const data = await aiService.explainJob(jobDescription);
      setExplainData(data);
      toast.success("Role breakdown generated!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to explain job role");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMatchProfile = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first");
      return;
    }
    setIsProcessing(true);
    setActiveWorkflow("match");
    try {
      const data = await aiService.matchProfileFit({
        jobDescription,
        resumeText: activeResumeText,
      });
      setMatchData(data);
      toast.success(`Match Fit Score: ${data.matchPercentage}%!`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to match profile fit");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setIsProcessing(true);
    setActiveWorkflow("cover-letter");
    try {
      const data = await aiService.generateCoverLetter({
        targetRole,
        companyName,
        jobDescription,
        resumeText: activeResumeText,
      });
      setCoverLetterData(data);
      toast.success("Tailored cover letter generated!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to generate cover letter");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateFollowUp = async (type: string = "after-application") => {
    setIsProcessing(true);
    setActiveWorkflow("followup");
    try {
      const data = await aiService.generateFollowUpEmail({
        companyName,
        role: targetRole,
        emailType: type,
      });
      setFollowUpData(data);
      toast.success("Follow-up email draft created!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to generate follow-up email");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSalaryInsights = async () => {
    setIsProcessing(true);
    setActiveWorkflow("salary");
    try {
      const data = await aiService.getSalaryInsights(targetRole, location);
      setSalaryData(data);
      toast.success("Salary insights retrieved!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to retrieve salary insights");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompanyResearch = async () => {
    setIsProcessing(true);
    setActiveWorkflow("company");
    try {
      const data = await aiService.researchCompany(companyName);
      setCompanyData(data);
      toast.success(`Retrieved research for ${companyName}!`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to research company");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const hasAnyResults = jdData || explainData || matchData || coverLetterData || followUpData || salaryData || companyData;

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      {/* SECTION HEADER & PERFECT 3-COLUMN INPUT GRID */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Job Intelligence Engine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-powered Job Description analysis, match score calculation, cover letters, and compensation benchmarks.
              </p>
            </div>
          </div>

          {activeResumeFileName && (
            <div className="px-3.5 py-1.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 shrink-0">
              ✓ Active Resume: {activeResumeFileName}
            </div>
          )}
        </div>

        {/* PROPER 3-COLUMN EQUAL WIDTH RESPONSIVE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Razorpay"
          />
          <Input
            label="Target Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Full Stack Developer"
          />
          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bangalore, India"
          />
        </div>

        {/* LARGE JD TEXTAREA */}
        <Textarea
          label="Job Description (JD)"
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste full job description text here to analyze requirements, calculate profile fit, and generate tailored application assets..."
        />

        {/* ACTION TOOLBAR: UNIFORM CONSISTENT ACTION BUTTONS */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleAnalyzeJD}
              isLoading={isProcessing && activeWorkflow === "jd"}
              leftIcon={<Sparkles size={16} />}
              className="bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 w-full"
            >
              Analyze JD
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleExplainJob}
              isLoading={isProcessing && activeWorkflow === "explain"}
              leftIcon={<HelpCircle size={15} />}
              className="w-full"
            >
              Explain Role
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleMatchProfile}
              isLoading={isProcessing && activeWorkflow === "match"}
              leftIcon={<Target size={15} />}
              className="w-full"
            >
              Match Score
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleGenerateCoverLetter}
              isLoading={isProcessing && activeWorkflow === "cover-letter"}
              leftIcon={<FileText size={15} />}
              className="w-full"
            >
              Cover Letter
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => handleGenerateFollowUp("after-application")}
              isLoading={isProcessing && activeWorkflow === "followup"}
              leftIcon={<Mail size={15} />}
              className="w-full"
            >
              Follow-up Email
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleSalaryInsights}
              isLoading={isProcessing && activeWorkflow === "salary"}
              leftIcon={<DollarSign size={15} />}
              className="w-full"
            >
              Salary Insights
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={handleCompanyResearch}
              isLoading={isProcessing && activeWorkflow === "company"}
              leftIcon={<Building2 size={15} />}
              className="w-full sm:col-span-2 lg:col-span-2"
            >
              Company Research
            </Button>
          </div>
        </div>
      </div>

      {/* GUIDED HELPER EMPTY STATE */}
      {!hasAnyResults && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto border border-purple-200 dark:border-purple-800">
            <Sparkles size={22} />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            AI Job Analyzer Ready
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Paste a job description above or select an action to analyze required skills, calculate fit, generate cover letters, and research market salaries.
          </p>
        </div>
      )}

      {/* RESULTS BREAKDOWN PANELS */}
      {jdData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" />
              Job Description Breakdown
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 shrink-0">
              Seniority: {jdData.seniority || "Mid-Senior"}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{jdData.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-2">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-200 block">Required Technical Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {(jdData.requiredSkills || []).map((s: string, i: number) => (
                  <span key={i} className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-purple-600 text-white">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Preferred Nice-to-Haves:</span>
              <div className="flex flex-wrap gap-1.5">
                {(jdData.preferredSkills || []).map((s: string, i: number) => (
                  <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {explainData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            Simplified Role & Expectations Breakdown
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
            {explainData.explanation || explainData.summary}
          </p>
        </div>
      )}

      {matchData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target size={18} className="text-purple-600" />
              Profile Match Fit Evaluation
            </h3>
            <span className="text-sm font-black px-4 py-1 rounded-full bg-purple-600 text-white">
              {matchData.matchPercentage}% Match
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">✓ Matched Resume Skills:</span>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {(matchData.matchingSkills || []).map((m: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">⚠ Missing Requirements:</span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                {(matchData.missingSkills || ["No major missing skills"]).map((m: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {coverLetterData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText size={18} className="text-purple-600" />
              Tailored Cover Letter
            </h3>
            <Button variant="outline" size="sm" onClick={() => handleCopyText(coverLetterData.coverLetter)} leftIcon={<Copy size={13} />}>
              Copy Cover Letter
            </Button>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <pre className="whitespace-pre-line text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
              {coverLetterData.coverLetter}
            </pre>
          </div>
        </div>
      )}

      {followUpData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Mail size={18} className="text-purple-600" />
              Professional Follow-Up Email Draft
            </h3>
            <Button variant="outline" size="sm" onClick={() => handleCopyText(`Subject: ${followUpData.subject}\n\n${followUpData.body}`)} leftIcon={<Copy size={13} />}>
              Copy Email Body
            </Button>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Subject: {followUpData.subject}</p>
            <hr className="border-slate-200 dark:border-slate-700 my-2" />
            <pre className="whitespace-pre-line text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
              {followUpData.body}
            </pre>
          </div>
        </div>
      )}

      {salaryData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-600" />
            Market Salary Benchmark & Negotiation Range
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <span className="text-[10px] font-bold text-purple-700 uppercase block">Average Salary</span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1 block">{salaryData.averageSalary}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Min - Max Range</span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1 block">{salaryData.minSalary} - {salaryData.maxSalary}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Market Confidence</span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1 block">{salaryData.confidence || "High"}</span>
            </div>
          </div>
        </div>
      )}

      {companyData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Building2 size={18} className="text-purple-600" />
            Company Intelligence: {companyData.company || companyName}
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {companyData.summary || companyData.overview}
          </p>
        </div>
      )}
    </div>
  );
}
