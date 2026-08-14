import { useState } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  Copy,
  Download,
  TrendingUp,
  Zap,
  FileSpreadsheet,
  ListOrdered,
  Layers,
  FileCode,
  FileType,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import Input from "../../ui/Input";
import { useResumeStore } from "../../../store/resumeStore";
import * as aiService from "../../../services/aiWorkspaceService";

export default function ResumeWorkspace() {
  const { activeResumeText, activeResumeFileName, setActiveResume } = useResumeStore();
  const [resumeText, setResumeText] = useState(activeResumeText || "");
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [bulletInput, setBulletInput] = useState("");
  const [docMeta, setDocMeta] = useState<{ fileName: string; wordCount: number; pageCount: number } | null>(
    activeResumeFileName ? { fileName: activeResumeFileName, wordCount: (activeResumeText || "").split(/\s+/).length, pageCount: 1 } : null
  );

  const [isParsing, setIsParsing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<"audit" | "star" | "generate" | null>(null);
  const [auditData, setAuditData] = useState<any>(null);
  const [starData, setStarData] = useState<any>(null);
  const [generatedResume, setGeneratedResume] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const parsed = await aiService.uploadAndParseDocument(file);
      const cleanText = (parsed.text || "").trim();
      setDocMeta(parsed);
      setResumeText(cleanText);
      setActiveResume(cleanText, parsed.fileName);
      toast.success(`Parsed ${parsed.fileName} (${parsed.wordCount} words, ${parsed.pageCount} pages)`);
    } catch (err: any) {
      if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        try {
          const text = await file.text();
          const words = text.split(/\s+/).length;
          const meta = { fileName: file.name, wordCount: words, pageCount: 1 };
          setDocMeta(meta);
          setResumeText(text);
          setActiveResume(text, file.name);
          toast.success(`Parsed text file ${file.name} (${words} words)`);
          return;
        } catch (_textErr) {}
      }
      toast.error(err.response?.data?.error || err.message || "Failed to parse document text");
    } finally {
      setIsParsing(false);
      e.target.value = "";
    }
  };

  const handleRunFullAudit = async () => {
    if (!resumeText.trim()) {
      toast.error("Please upload a resume or paste resume text first");
      return;
    }
    setIsProcessing(true);
    setActiveWorkflow("audit");
    try {
      const data = await aiService.auditResume(resumeText, targetRole);
      setAuditData(data);
      toast.success("Full Resume Audit complete!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to perform full resume audit");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRewriteSTARBullet = async () => {
    const bulletToUse = bulletInput.trim() || resumeText.split("\n").find((l) => l.trim().length > 15) || resumeText.slice(0, 100);
    if (!bulletToUse.trim()) {
      toast.error("Please enter a bullet point to rewrite");
      return;
    }
    setIsProcessing(true);
    setActiveWorkflow("star");
    try {
      const data = await aiService.optimizeBullets(bulletToUse);
      setStarData(data);
      toast.success("STAR Bullet Point rewritten!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to rewrite STAR bullet point");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!resumeText.trim()) {
      toast.error("Please upload a resume or paste details first");
      return;
    }
    setIsProcessing(true);
    setActiveWorkflow("generate");
    try {
      const data = await aiService.generateResume({
        name: targetRole ? `Candidate (${targetRole})` : "Candidate",
        skills: resumeText ? [resumeText] : ["React", "TypeScript", "Node.js"],
      });
      setGeneratedResume(data);
      toast.success("Professional resume generated!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to generate resume");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const exportMarkdown = () => {
    if (!generatedResume?.resumeMarkdown && !resumeText) return;
    const content = generatedResume?.resumeMarkdown || `# Resume\n\n${resumeText}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Resume_${Date.now()}.md`;
    a.click();
    toast.success("Exported Markdown (.md)");
  };

  const exportPDF = () => {
    window.print();
    toast.success("Opening PDF Print Dialog");
  };

  const exportDOCX = () => {
    const content = generatedResume?.resumeMarkdown || resumeText;
    const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Resume_${Date.now()}.docx`;
    a.click();
    toast.success("Exported DOCX document");
  };

  return (
    <div className="space-y-6 w-full">
      <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0 shadow-2xs">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Resume Intelligence Engine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ATS scoring, section reviews, STAR bullet transformations, and multi-format exports.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {activeResumeFileName && (
              <div className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                ✓ Active: {activeResumeFileName}
              </div>
            )}
            <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs cursor-pointer shadow-sm shadow-indigo-600/20 transition-all">
              <Upload size={14} />
              <span>{isParsing ? "Parsing..." : "Upload Resume (PDF/Doc)"}</span>
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {docMeta && (
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">{docMeta.fileName}</span>
                <span className="text-slate-500 ml-2 font-medium">({docMeta.pageCount} pages, {docMeta.wordCount} words)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setDocMeta(null);
                setResumeText("");
                setActiveResume("");
              }}
              className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Clear Upload
            </button>
          </div>
        )}

        <div className="space-y-4 w-full">
          <Input
            label="Target Job Title / Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer"
            className="w-full"
          />

          <Textarea
            label="Resume Text / Profile Information"
            rows={5}
            value={resumeText}
            onChange={(e) => {
              const val = e.target.value;
              setResumeText(val);
              setActiveResume(val);
            }}
            placeholder="Paste your complete resume text here or upload a PDF/Word file above to run full ATS audits..."
            className="w-full"
          />

          <Input
            label="Individual Bullet Point for STAR Rewriting (Optional)"
            value={bulletInput}
            onChange={(e) => setBulletInput(e.target.value)}
            placeholder="e.g. Built React analytics dashboard and improved backend performance."
            className="w-full"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <Button
              variant="primary"
              size="md"
              onClick={handleRunFullAudit}
              isLoading={isProcessing && activeWorkflow === "audit"}
              leftIcon={<TrendingUp size={15} />}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20 w-full"
            >
              1. Full ATS Audit
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleRewriteSTARBullet}
              isLoading={isProcessing && activeWorkflow === "star"}
              leftIcon={<Zap size={15} />}
              className="w-full"
            >
              2. STAR Bullet Rewriter
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleGenerateResume}
              isLoading={isProcessing && activeWorkflow === "generate"}
              leftIcon={<Sparkles size={15} />}
              className="w-full"
            >
              3. Generate AI Resume
            </Button>
          </div>
        </div>
      </div>

      {!auditData && !starData && !generatedResume && (
        <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3 shadow-2xs w-full">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-800">
            <Sparkles size={20} />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Resume Intelligence Ready
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
            Upload a resume or paste resume text above to audit your ATS score, transform STAR bullet points, and export tailored formats.
          </p>
        </div>
      )}

      {auditData && (
        <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles size={17} className="text-indigo-500" />
              Full Resume Audit Report
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
              Grade: {auditData.overallGrade || "A"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            <div className="lg:col-span-4 p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center flex flex-col justify-center items-center">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">ATS Readiness Score</span>
              <span className="text-4xl font-black text-slate-900 dark:text-slate-100 my-1">{auditData.atsScore} / 100</span>
              <span className="text-xs font-bold text-indigo-600">Overall Grade: {auditData.overallGrade || "A"}</span>
            </div>

            <div className="lg:col-span-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block">Executive Summary:</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{auditData.summary}</p>
            </div>
          </div>

          {auditData.sectionBySection && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers size={14} /> Section-by-Section Review
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(auditData.sectionBySection).map(([section, info]: [string, any]) => (
                  <div key={section} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold capitalize text-slate-900 dark:text-slate-100">{section}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        (info.score || 80) >= 85 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}>
                        {info.score || 80}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{info.feedback || "Good alignment with standard formatting."}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">Detected Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {(auditData.keywordAnalysis?.foundKeywords || auditData.strengths || ["React", "TypeScript"]).map((kw: string, i: number) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">Missing Target Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {(auditData.missingKeywords || auditData.keywordAnalysis?.missingKeywords || ["AWS", "DOCKER", "CI/CD"]).map((kw: string, i: number) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-[11px] font-bold">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {auditData.actionPlan && (
            <div className="p-4 sm:p-5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2.5">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block flex items-center gap-1.5 uppercase tracking-wider">
                <ListOrdered size={14} /> Recommended Action Plan:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {auditData.actionPlan.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {starData && (
        <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 w-full">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap size={17} className="text-amber-500" />
              STAR Bullet Transformation Result
            </h3>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(starData.rewritten)} leftIcon={<Copy size={13} />}>
              Copy Bullet
            </Button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Original Input Bullet:</span>
            <p className="text-slate-700 dark:text-slate-300 italic font-medium">"{starData.original}"</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">✨ STAR Rewritten Bullet (Situation/Task, Action, Result):</span>
            <p className="text-slate-900 dark:text-slate-100 font-extrabold text-sm leading-relaxed">{starData.rewritten}</p>
          </div>

          {starData.whyBetter && (
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed">
              <strong>Why it's better:</strong> {starData.whyBetter}
            </div>
          )}
        </div>
      )}

      {generatedResume && (
        <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileSpreadsheet size={17} className="text-indigo-500" />
                Generated Professional Resume
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Ready for review and multi-format export.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={exportMarkdown} leftIcon={<FileCode size={13} />}>
                Export Markdown (.md)
              </Button>
              <Button variant="outline" size="sm" onClick={exportPDF} leftIcon={<Download size={13} />}>
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={exportDOCX} leftIcon={<FileType size={13} />}>
                Export DOCX
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
            {generatedResume.resumeMarkdown || JSON.stringify(generatedResume, null, 2)}
          </div>
        </div>
      )}
    </div>
  );
}
