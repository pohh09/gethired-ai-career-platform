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
    <div className="space-y-8 w-full">
      {/* 1. HEADER & FORM CARD */}
      <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shrink-0 shadow-2xs">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Job Intelligence Engine
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                AI-powered Job Description analysis, match score calculation, cover letters, and compensation benchmarks.
              </p>
            </div>
          </div>

          {activeResumeFileName && (
            <div className="px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 shrink-0">
              ✓ Active: {activeResumeFileName}
            </div>
          )}
        </div>

        {/* 3-COLUMN EQUAL WIDTH FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          <Input
            label="Company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Razorpay"
            className="w-full"
          />
          <Input
            label="Target Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Full Stack Developer"
            className="w-full"
          />
          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bangalore, India"
            className="w-full"
          />
        </div>

        {/* LARGE JD TEXTAREA */}
        <div className="w-full">
          <Textarea
            label="Job Description (JD)"
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste full job description text here to analyze requirements, calculate profile fit, and generate tailored application assets..."
            className="w-full"
          />
        </div>

        {/* ACTION TOOLBAR: 2-ROW GRID */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAnalyzeJD}
              isLoading={isProcessing && activeWorkflow === "jd"}
              leftIcon={<Sparkles size={18} />}
              className="bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 w-full"
            >
              Analyze JD
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleExplainJob}
              isLoading={isProcessing && activeWorkflow === "explain"}
              leftIcon={<HelpCircle size={18} />}
              className="w-full"
            >
              Explain Role
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleMatchProfile}
              isLoading={isProcessing && activeWorkflow === "match"}
              leftIcon={<Target size={18} />}
              className="w-full"
            >
              Match Score
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleGenerateCoverLetter}
              isLoading={isProcessing && activeWorkflow === "cover-letter"}
              leftIcon={<FileText size={18} />}
              className="w-full"
            >
              Cover Letter
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleGenerateFollowUp("after-application")}
              isLoading={isProcessing && activeWorkflow === "followup"}
              leftIcon={<Mail size={18} />}
              className="w-full"
            >
              Follow-up Email
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleSalaryInsights}
              isLoading={isProcessing && activeWorkflow === "salary"}
              leftIcon={<DollarSign size={18} />}
              className="w-full"
            >
              Salary Insights
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleCompanyResearch}
              isLoading={isProcessing && activeWorkflow === "company"}
              leftIcon={<Building2 size={18} />}
              className="w-full"
            >
              Company Research
            </Button>
          </div>
        </div>
      </div>

      {/* 2. GUIDED HELPER EMPTY STATE */}
      {!hasAnyResults && (
        <div className="p-10 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-xs w-full">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto border border-purple-200 dark:border-purple-800">
            <Sparkles size={26} />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            AI Job Analyzer Ready
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
            Paste a job description above or select an action to analyze required skills, calculate fit, generate cover letters, and research market salaries.
          </p>
        </div>
      )}

      {/* 3. RESULTS BREAKDOWN PANELS */}
      {jdData && (
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Sparkles size={20} className="text-purple-600" />
              Job Description Breakdown
            </h3>
            <span className="text-xs font-black px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 shrink-0">
              Seniority: {jdData.seniority || "Mid-Senior"}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{jdData.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
              <span className="text-xs font-black text-purple-900 dark:text-purple-200 uppercase tracking-wider block">Required Technical Skills:</span>
              <div className="flex flex-wrap gap-2">
                {(jdData.requiredSkills || []).map((s: string, i: number) => (
                  <span key={i} className="text-xs font-black px-3 py-1 rounded-xl bg-purple-600 text-white shadow-2xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider block">Preferred Nice-to-Haves:</span>
              <div className="flex flex-wrap gap-2">
                {(jdData.preferredSkills || []).map((s: string, i: number) => (
                  <span key={i} className="text-xs font-black px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {explainData && (
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5 w-full">
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-4">
            Simplified Role & Expectations Breakdown
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
            {explainData.explanation || explainData.summary}
          </p>
        </div>
      )}

      {matchData && (
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 w-full">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Target size={20} className="text-purple-600" />
              Profile Match Fit Evaluation
            </h3>
            <span className="text-sm font-black px-5 py-1.5 rounded-full bg-purple-600 text-white shadow-sm">
              {matchData.matchPercentage}% Match
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider block">✓ Matched Resume Skills:</span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                {(matchData.matchingSkills || []).map((m: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">⚠ Missing Requirements:</span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                {(matchData.missingSkills || ["No major missing skills"]).map((m: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-slate-400 font-black">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {coverLetterData && (
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5 w-full">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <FileText size={20} className="text-purple-600" />
              Tailored Cover Letter
            </h3>
            <Button variant="outline" size="sm" onClick={() => handleCopyText(coverLetterData.coverLetter)} leftIcon={<Copy size={14} />}>
              Copy Cover Letter
            </Button>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <pre className="whitespace-pre-line text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
              {coverLetterData.coverLetter}
            </pre>
          </div>
        </div>
      )}

      {followUpData && (
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5 w-full">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Mail size={20} className="text-purple-600" />
              Professional Follow-Up Email Draft
            </h3>
            <Button variant="outline" size="sm" onClick={() => handleCopyText(`Subject: ${followUpData.subject}\n\n${followUpData.body}`)} leftIcon={<Copy size={14} />}>
              Copy Email Body
            </Button>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">Subject: {followUpData.subject}</p>
            <hr className="border-slate-200 dark:border-slate-700 my-2" />
            <pre className="whitespace-pre-line text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
              {followUpData.body}
            </pre>
          </div>
        </div>
      )}

      {salaryData && (
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5 w-full">
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2.5">
            <DollarSign size={20} className="text-emerald-600" />
            Market Salary Benchmark & Negotiation Range
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">Average Salary</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1.5 block">{salaryData.averageSalary}</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Min - Max Range</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1.5 block">{salaryData.minSalary} - {salaryData.maxSalary}</span>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Market Confidence</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1.5 block">{salaryData.confidence || "High"}</span>
            </div>
          </div>
        </div>
      )}

      {companyData && (
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5 w-full">
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2.5">
            <Building2 size={20} className="text-purple-600" />
            Company Intelligence: {companyData.company || companyName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {companyData.summary || companyData.overview}
          </p>
        </div>
      )}
    </div>
  );
}
