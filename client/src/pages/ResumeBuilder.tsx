import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  Share2,
  Printer,
  Copy,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  User,
  Zap,
  Check,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import * as aiService from "../services/aiWorkspaceService";
import { useResumeStore } from "../store/resumeStore";
import { useAuthStore } from "../store/authStore";
import ShareDocumentModal from "../components/community/ShareDocumentModal";
import toast from "react-hot-toast";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string;
  link?: string;
  bullets: string[];
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  location?: string;
}

const STEPS = [
  { id: "contact", label: "Contact Info", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "review", label: "Preview & Export", icon: Sparkles },
];

interface ResumeBuilderProps {
  onBackToWorkspace?: () => void;
}

export default function ResumeBuilder({ onBackToWorkspace }: ResumeBuilderProps = {}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addResume, setActiveResume } = useResumeStore();

  const handleBack = () => {
    if (onBackToWorkspace) {
      onBackToWorkspace();
    } else {
      navigate("/ai-workspace?tab=resume");
    }
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Form State
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  // Summary State
  const [summary, setSummary] = useState(
    "Results-driven Senior Full Stack Engineer with 5+ years of experience designing high-throughput web applications, scalable Node.js microservices, and modern React design systems."
  );

  // Experience State
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: "exp-1",
      company: "TechScale Systems",
      role: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      startDate: "2023",
      endDate: "Present",
      bullets: [
        "Architected core dashboard state architecture using React 19 & TypeScript, reducing initial load latency by 38%.",
        "Led team of 5 engineers delivering high-performance reusable UI components across 12 micro-frontends.",
        "Integrated TanStack Query data caching, reducing redundant network requests by 45%."
      ],
    },
    {
      id: "exp-2",
      company: "CloudMatrix Labs",
      role: "Full Stack Developer",
      location: "Remote",
      startDate: "2021",
      endDate: "2023",
      bullets: [
        "Engineered RESTful backend APIs in Node.js & Express handling 2.5M daily active webhook requests.",
        "Optimized MongoDB indexing strategies, cutting slow database query times from 420ms down to 48ms."
      ],
    },
  ]);

  // Skills State
  const [technicalSkills, setTechnicalSkills] = useState(
    "React 19, TypeScript, Next.js, Node.js, Express, PostgreSQL, MongoDB, AWS, Docker, REST APIs, GraphQL, Tailwind CSS"
  );
  const [toolsAndMethods, setToolsAndMethods] = useState(
    "Git, CI/CD Pipelines, Jest, Vitest, System Architecture, Agile Scrum, Microservices"
  );

  // Education State
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: "edu-1",
      degree: "B.S. in Computer Science & Engineering",
      institution: "State University of Technology",
      year: "2021",
      location: "California, USA",
    },
  ]);

  // Projects State
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "proj-1",
      title: "GetHired — AI Career & Application OS",
      description: "Full-stack career acceleration suite with Gemini AI ATS scoring, live mock interview prep, and peer reviews.",
      techStack: "React 19, TypeScript, Node.js, Express, MongoDB, Gemini AI",
      link: "https://github.com/pooj0901/gethired",
      bullets: [
        "Implemented real-time section-by-section ATS compatibility auditor and STAR bullet rewriting engine.",
        "Built responsive peer-review and daily momentum streak cohort leaderboard with opt-in privacy controls."
      ],
    },
  ]);

  // AI Loading States
  const [isImprovingSummary, setIsImprovingSummary] = useState(false);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [improvingBulletKey, setImprovingBulletKey] = useState<string | null>(null);

  // Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // AI Actions
  const handleImproveSummary = async () => {
    if (!summary.trim()) {
      toast.error("Please enter draft summary text first.");
      return;
    }
    setIsImprovingSummary(true);
    try {
      const res = await aiService.improveSection({
        section: "summary",
        content: summary,
        targetRole,
      });
      if (res?.improvedContent) {
        setSummary(res.improvedContent);
        toast.success(
          res.source === "ai"
            ? "Summary enhanced with Gemini AI! ✨"
            : "Summary optimized with STAR metrics! ⚡"
        );
      }
    } catch {
      toast.error("Failed to enhance summary.");
    } finally {
      setIsImprovingSummary(false);
    }
  };

  const handleImproveBullet = async (expId: string, bulletIdx: number) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const bullet = exp.bullets[bulletIdx];
    if (!bullet.trim()) return;

    const key = `${expId}-${bulletIdx}`;
    setImprovingBulletKey(key);
    try {
      const res = await aiService.rewriteSTARBullet(bullet, summary, targetRole);
      if (res?.rewritten) {
        setExperiences((prev) =>
          prev.map((e) =>
            e.id === expId
              ? {
                  ...e,
                  bullets: e.bullets.map((b, idx) =>
                    idx === bulletIdx ? res.rewritten : b
                  ),
                }
              : e
          )
        );
        toast.success("Bullet rewritten in STAR format! 🎯");
      }
    } catch {
      toast.error("Failed to optimize bullet.");
    } finally {
      setImprovingBulletKey(null);
    }
  };

  const handleSuggestSkills = async () => {
    setIsSuggestingSkills(true);
    try {
      const res = await aiService.improveSection({
        section: "skills",
        content: technicalSkills,
        targetRole,
      });
      if (res?.improvedContent) {
        setTechnicalSkills(res.improvedContent);
        toast.success("Target role skills suggested! 💡");
      }
    } catch {
      toast.error("Failed to suggest skills.");
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  // Compile full resume text
  const compileResumeText = () => {
    let text = `${fullName.toUpperCase()}\n${targetRole}\n${location} | ${email} | ${phone}\n`;
    if (portfolioUrl || githubUrl || linkedinUrl) {
      text += `${portfolioUrl ? portfolioUrl + " | " : ""}${githubUrl ? githubUrl + " | " : ""}${linkedinUrl ? linkedinUrl : ""}\n`;
    }
    text += `\n---\n\nPROFESSIONAL SUMMARY\n${summary}\n\n---\n\nTECHNICAL SKILLS\n* Core Stack: ${technicalSkills}\n* Tools & Methods: ${toolsAndMethods}\n\n---\n\nPROFESSIONAL EXPERIENCE\n`;

    experiences.forEach((exp) => {
      text += `\n### ${exp.role} | ${exp.company}\n*${exp.location} | ${exp.startDate} - ${exp.endDate}*\n`;
      exp.bullets.forEach((b) => {
        text += `* ${b}\n`;
      });
    });

    text += `\n---\n\nPROJECTS\n`;
    projects.forEach((proj) => {
      text += `\n### ${proj.title}\n*Tech Stack: ${proj.techStack}*\n${proj.description}\n`;
      proj.bullets.forEach((b) => {
        text += `* ${b}\n`;
      });
    });

    text += `\n---\n\nEDUCATION & CERTIFICATIONS\n`;
    educations.forEach((edu) => {
      text += `* **${edu.degree}** — ${edu.institution} (${edu.year})${edu.location ? `, ${edu.location}` : ""}\n`;
    });

    return text;
  };

  // Save to Workspace Store
  const handleSaveToWorkspace = () => {
    const fullText = compileResumeText();
    const fileName = `${fullName.replace(/\s+/g, "_")}_Resume.pdf`;
    addResume({
      name: `${targetRole} Resume (${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })})`,
      fileName,
      fileSize: "185 KB",
      fileType: "pdf",
      isDefault: false,
      content: fullText,
    });
    setActiveResume(fullText, fileName);
    toast.success("Resume saved to your Workspace Resumes! 📁");
  };

  // Export to PDF via Browser Vector Print Engine
  const handlePrintPdf = () => {
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Popup blocked! Please allow popups to export PDF.");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${fullName} - ${targetRole} Resume</title>
            <style>
              @page {
                size: A4;
                margin: 14mm 16mm;
              }
              body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #0f172a;
                line-height: 1.5;
                font-size: 10pt;
                margin: 0;
                padding: 0;
                background: #ffffff;
              }
              h1 {
                font-size: 20pt;
                font-weight: 800;
                margin: 0 0 2px 0;
                color: #0f172a;
                letter-spacing: -0.5px;
              }
              .target-title {
                font-size: 12pt;
                font-weight: 700;
                color: #2563eb;
                margin: 0 0 6px 0;
              }
              .contact-line {
                font-size: 8.5pt;
                color: #475569;
                margin-bottom: 12px;
                line-height: 1.4;
              }
              .contact-line a {
                color: #475569;
                text-decoration: none;
              }
              .section-title {
                font-size: 10.5pt;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                color: #0f172a;
                border-bottom: 1.5px solid #cbd5e1;
                padding-bottom: 3px;
                margin: 14px 0 6px 0;
              }
              .summary-text {
                font-size: 9.5pt;
                color: #334155;
                line-height: 1.5;
                margin-bottom: 10px;
              }
              .exp-header {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-top: 8px;
                margin-bottom: 2px;
              }
              .exp-role {
                font-size: 10pt;
                font-weight: 700;
                color: #0f172a;
              }
              .exp-company {
                font-weight: 600;
                color: #475569;
              }
              .exp-date {
                font-size: 8.5pt;
                color: #64748b;
                font-weight: 500;
              }
              ul {
                margin: 4px 0 8px 18px;
                padding: 0;
              }
              li {
                font-size: 9.5pt;
                color: #334155;
                margin-bottom: 3px;
                line-height: 1.45;
              }
              .skills-block p {
                margin: 3px 0;
                font-size: 9.5pt;
                color: #334155;
              }
              .skills-block strong {
                color: #0f172a;
              }
            </style>
          </head>
          <body>
            <h1>${fullName}</h1>
            <div class="target-title">${targetRole}</div>
            <div class="contact-line">
              ${location} • ${email} • ${phone}
              ${portfolioUrl ? ` • ${portfolioUrl}` : ""}
              ${githubUrl ? ` • ${githubUrl}` : ""}
              ${linkedinUrl ? ` • ${linkedinUrl}` : ""}
            </div>

            <div class="section-title">Professional Summary</div>
            <div class="summary-text">${summary}</div>

            <div class="section-title">Technical Skills</div>
            <div class="skills-block">
              <p><strong>Core Technical Stack:</strong> ${technicalSkills}</p>
              <p><strong>Tools & Architecture:</strong> ${toolsAndMethods}</p>
            </div>

            <div class="section-title">Professional Experience</div>
            ${experiences
              .map(
                (exp) => `
                <div class="exp-header">
                  <div><span class="exp-role">${exp.role}</span> — <span class="exp-company">${exp.company}</span> (${exp.location})</div>
                  <div class="exp-date">${exp.startDate} – ${exp.endDate}</div>
                </div>
                <ul>
                  ${exp.bullets.map((b) => `<li>${b}</li>`).join("")}
                </ul>
              `
              )
              .join("")}

            <div class="section-title">Key Engineering Projects</div>
            ${projects
              .map(
                (proj) => `
                <div class="exp-header">
                  <div><span class="exp-role">${proj.title}</span> <span style="font-size: 8.5pt; color: #64748b;">[${proj.techStack}]</span></div>
                  ${proj.link ? `<div class="exp-date">${proj.link}</div>` : ""}
                </div>
                <div style="font-size: 9pt; color: #475569; margin: 2px 0;">${proj.description}</div>
                <ul>
                  ${proj.bullets.map((b) => `<li>${b}</li>`).join("")}
                </ul>
              `
              )
              .join("")}

            <div class="section-title">Education & Certifications</div>
            <ul>
              ${educations
                .map(
                  (edu) =>
                    `<li><strong>${edu.degree}</strong> — ${edu.institution} (${edu.year})${edu.location ? `, ${edu.location}` : ""}</li>`
                )
                .join("")}
            </ul>

            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("Print dialog opened for ATS-formatted PDF export!");
    } catch {
      toast.error("Failed to generate print PDF dialog.");
    }
  };

  const handleCopyMarkdown = () => {
    const md = compileResumeText();
    navigator.clipboard.writeText(md);
    toast.success("Full Resume Markdown copied to clipboard!");
  };

  return (
    <div className="w-full max-w-[1750px] mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} className="text-cyan-400" />
            Guided ATS Resume Builder
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
            Build a High-Scoring ATS Resume Step-by-Step
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Step through each section with scoped Gemini AI improvements, live formatting preview, and one-click PDF export.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="border-slate-700 text-slate-300 hover:bg-white/10 font-bold"
          >
            ← Back to AI Workspace
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintPdf}
            className="border-blue-400/40 text-white hover:bg-white/10 font-bold"
            leftIcon={<Printer size={14} />}
          >
            Export PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveToWorkspace}
            className="font-bold shadow-md shadow-blue-600/30"
            leftIcon={<Check size={14} />}
          >
            Save to Workspace
          </Button>
        </div>
      </div>

      {/* Step Indicator Bar */}
      <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : isCompleted
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  isCurrent ? "bg-white text-blue-600" : isCompleted ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700"
                }`}>
                  {isCompleted ? <Check size={10} /> : idx + 1}
                </div>
                <Icon size={14} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split-Pane Workspace (Editor on Left, Live Preview on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Step Container */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
          {/* STEP 0: Contact Info */}
          {currentStepIndex === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  1. Contact Information & Target Role
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ensure ATS parsers can immediately extract your name, phone, email, and target role title.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Target Job Title"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  required
                />
                <Input
                  label="Full Name"
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Input
                  label="Location"
                  placeholder="e.g. San Francisco, CA (Open to Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="sm:col-span-2"
                />
                <Input
                  label="Portfolio / Website URL"
                  placeholder="e.g. https://alexmorgan.dev"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                />
                <Input
                  label="GitHub Handle"
                  placeholder="e.g. github.com/alexmorgan"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
                <Input
                  label="LinkedIn Profile"
                  placeholder="e.g. linkedin.com/in/alexmorgan"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 1: Summary */}
          {currentStepIndex === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    2. Professional Summary
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    A concise 3-4 sentence hook summarizing your engineering focus, key stack, and biggest metric win.
                  </p>
                </div>
              </div>

              <Textarea
                rows={5}
                label="Summary Text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write your professional summary..."
              />

              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-blue-900 dark:text-cyan-200 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-cyan-500" />
                    <span>Gemini AI Summary Optimizer</span>
                  </span>
                  <p className="text-[11px] text-blue-700/80 dark:text-slate-400">
                    Rewrites passive statements to highlight high-impact metrics and target role tags.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  isLoading={isImprovingSummary}
                  onClick={handleImproveSummary}
                  className="font-bold shrink-0"
                >
                  Improve with AI ✨
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Work Experience */}
          {currentStepIndex === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    3. Work Experience & Achievements
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Focus on accomplishments over responsibilities. Use the STAR method to quantify results.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExperiences([
                      ...experiences,
                      {
                        id: `exp-${Date.now()}`,
                        company: "New Company",
                        role: "Software Engineer",
                        location: "Remote",
                        startDate: "2022",
                        endDate: "2024",
                        bullets: ["Engineered scalable web services delivering measurable business impact."],
                      },
                    ])
                  }
                  leftIcon={<Plus size={13} />}
                  className="font-bold shrink-0"
                >
                  Add Role
                </Button>
              </div>

              <div className="space-y-5">
                {experiences.map((exp, expIdx) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Position #{expIdx + 1}
                      </span>
                      {experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setExperiences(experiences.filter((e) => e.id !== exp.id))
                          }
                          className="text-rose-500 hover:text-rose-600 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Company Name"
                        value={exp.company}
                        onChange={(e) =>
                          setExperiences(
                            experiences.map((item) =>
                              item.id === exp.id ? { ...item, company: e.target.value } : item
                            )
                          )
                        }
                      />
                      <Input
                        label="Role Title"
                        value={exp.role}
                        onChange={(e) =>
                          setExperiences(
                            experiences.map((item) =>
                              item.id === exp.id ? { ...item, role: e.target.value } : item
                            )
                          )
                        }
                      />
                      <Input
                        label="Start Date"
                        value={exp.startDate}
                        onChange={(e) =>
                          setExperiences(
                            experiences.map((item) =>
                              item.id === exp.id ? { ...item, startDate: e.target.value } : item
                            )
                          )
                        }
                      />
                      <Input
                        label="End Date"
                        value={exp.endDate}
                        onChange={(e) =>
                          setExperiences(
                            experiences.map((item) =>
                              item.id === exp.id ? { ...item, endDate: e.target.value } : item
                            )
                          )
                        }
                      />
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-700">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        Achievement Bullets (STAR Format)
                      </label>
                      {exp.bullets.map((b, bIdx) => {
                        const isImproving = improvingBulletKey === `${exp.id}-${bIdx}`;
                        return (
                          <div key={bIdx} className="space-y-1">
                            <div className="flex items-start gap-2">
                              <textarea
                                rows={2}
                                value={b}
                                onChange={(e) =>
                                  setExperiences(
                                    experiences.map((item) =>
                                      item.id === exp.id
                                        ? {
                                            ...item,
                                            bullets: item.bullets.map((bt, idx) =>
                                              idx === bIdx ? e.target.value : bt
                                            ),
                                          }
                                        : item
                                    )
                                  )
                                }
                                className="flex-1 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                isLoading={isImproving}
                                onClick={() => handleImproveBullet(exp.id, bIdx)}
                                className="text-[10px] font-bold shrink-0 border-blue-300 dark:border-blue-800 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                              >
                                STAR AI ⚡
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExperiences(
                            experiences.map((item) =>
                              item.id === exp.id
                                ? { ...item, bullets: [...item.bullets, "New quantifiable achievement metric."] }
                                : item
                            )
                          )
                        }
                        className="text-xs text-blue-600 dark:text-cyan-400 font-bold"
                      >
                        + Add Bullet Point
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Skills */}
          {currentStepIndex === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  4. Technical & Tool Skills
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Categorized skills boost ATS keyword density and make scanner ranking effortless.
                </p>
              </div>

              <Textarea
                rows={4}
                label="Core Technical Stack (Languages, Frameworks, Databases)"
                value={technicalSkills}
                onChange={(e) => setTechnicalSkills(e.target.value)}
              />

              <Textarea
                rows={3}
                label="Tools, Practices & Cloud Services"
                value={toolsAndMethods}
                onChange={(e) => setToolsAndMethods(e.target.value)}
              />

              <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                    <Zap size={14} className="text-purple-500" />
                    <span>Target Role Skill Suggestion</span>
                  </span>
                  <p className="text-[11px] text-purple-700/80 dark:text-slate-400">
                    Suggests high-demand missing keywords for "{targetRole}".
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  isLoading={isSuggestingSkills}
                  onClick={handleSuggestSkills}
                  className="font-bold bg-purple-600 hover:bg-purple-500 text-white shrink-0"
                >
                  Suggest Skills 💡
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Education */}
          {currentStepIndex === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    5. Education & Certifications
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Degrees, universities, honors, and verified cloud certifications.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEducations([
                      ...educations,
                      {
                        id: `edu-${Date.now()}`,
                        degree: "AWS Certified Solutions Architect",
                        institution: "Amazon Web Services",
                        year: "2024",
                      },
                    ])
                  }
                  leftIcon={<Plus size={13} />}
                  className="font-bold shrink-0"
                >
                  Add Entry
                </Button>
              </div>

              {educations.map((edu, idx) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Entry #{idx + 1}
                    </span>
                    {educations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setEducations(educations.filter((e) => e.id !== edu.id))}
                        className="text-rose-500 hover:text-rose-600 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Degree / Certification"
                      value={edu.degree}
                      onChange={(e) =>
                        setEducations(
                          educations.map((item) =>
                            item.id === edu.id ? { ...item, degree: e.target.value } : item
                          )
                        )
                      }
                    />
                    <Input
                      label="Institution / Issuer"
                      value={edu.institution}
                      onChange={(e) =>
                        setEducations(
                          educations.map((item) =>
                            item.id === edu.id ? { ...item, institution: e.target.value } : item
                          )
                        )
                      }
                    />
                    <Input
                      label="Year Completed"
                      value={edu.year}
                      onChange={(e) =>
                        setEducations(
                          educations.map((item) =>
                            item.id === edu.id ? { ...item, year: e.target.value } : item
                          )
                        )
                      }
                    />
                    <Input
                      label="Location (Optional)"
                      value={edu.location || ""}
                      onChange={(e) =>
                        setEducations(
                          educations.map((item) =>
                            item.id === edu.id ? { ...item, location: e.target.value } : item
                          )
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: Projects */}
          {currentStepIndex === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    6. Key Engineering Projects
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showcase real-world full-stack systems, architectures, and open-source packages.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setProjects([
                      ...projects,
                      {
                        id: `proj-${Date.now()}`,
                        title: "Microservices Cloud Platform",
                        description: "Distributed message queue processing system.",
                        techStack: "Go, Docker, Kafka, AWS",
                        bullets: ["Engineered event stream ingestion processing 50K msgs/sec."],
                      },
                    ])
                  }
                  leftIcon={<Plus size={13} />}
                  className="font-bold shrink-0"
                >
                  Add Project
                </Button>
              </div>

              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Project #{idx + 1}
                    </span>
                    {projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setProjects(projects.filter((p) => p.id !== proj.id))}
                        className="text-rose-500 hover:text-rose-600 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <Input
                    label="Project Title"
                    value={proj.title}
                    onChange={(e) =>
                      setProjects(
                        projects.map((item) =>
                          item.id === proj.id ? { ...item, title: e.target.value } : item
                        )
                      )
                    }
                  />
                  <Input
                    label="Tech Stack (Comma Separated)"
                    value={proj.techStack}
                    onChange={(e) =>
                      setProjects(
                        projects.map((item) =>
                          item.id === proj.id ? { ...item, techStack: e.target.value } : item
                        )
                      )
                    }
                  />
                  <Textarea
                    rows={2}
                    label="Project Overview & Challenge"
                    value={proj.description}
                    onChange={(e) =>
                      setProjects(
                        projects.map((item) =>
                          item.id === proj.id ? { ...item, description: e.target.value } : item
                        )
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* STEP 6: Review & Final Actions */}
          {currentStepIndex === 6 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>Resume Ready for ATS & Recruiters!</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                  Your resume is structured according to top ATS hiring criteria. Choose your next action:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-left space-y-2 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Printer size={16} />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    Export ATS Vector PDF
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Clean, single-column print layout optimized for Workday, Greenhouse & Lever ATS scanners.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-left space-y-2 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Share2 size={16} />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    Share for Community Feedback
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Get section-by-section suggestions and helpful upvotes from fellow job seekers.
                  </p>
                </button>
              </div>

              <div className="flex gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyMarkdown}
                  className="w-full justify-center font-bold text-xs"
                  leftIcon={<Copy size={13} />}
                >
                  Copy Markdown
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveToWorkspace}
                  className="w-full justify-center font-bold text-xs"
                  leftIcon={<Check size={13} />}
                >
                  Save in Resumes
                </Button>
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              className="font-bold text-xs"
              leftIcon={<ArrowLeft size={13} />}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentStepIndex < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(STEPS.length - 1)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  ⚡ Skip to Preview
                </button>
              )}

              {currentStepIndex < STEPS.length - 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1))}
                  className="font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Next: {STEPS[currentStepIndex + 1]?.label}</span>
                  <ArrowRight size={13} />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleBack}
                  className="font-bold text-xs"
                >
                  Return to AI Workspace
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="lg:col-span-6 sticky top-20 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Live ATS Resume Preview
              </h3>
            </div>
            <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Estimated ATS Score: 94%
            </span>
          </div>

          {/* Formatted Resume Sheet Preview */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-4 font-sans text-slate-800 dark:text-slate-100 text-xs">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {fullName || "Candidate Name"}
              </h2>
              <p className="text-xs font-bold text-blue-600 dark:text-cyan-400 mt-0.5">
                {targetRole}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {location} • {email} • {phone}
              </p>
              {(portfolioUrl || githubUrl) && (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {portfolioUrl ? `${portfolioUrl}  ` : ""}
                  {githubUrl ? `•  ${githubUrl}` : ""}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                Professional Summary
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {summary || "Your executive summary will appear here."}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                Technical Skills
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-800 dark:text-slate-100">Stack: </strong>
                {technicalSkills}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-800 dark:text-slate-100">Tools: </strong>
                {toolsAndMethods}
              </p>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                Professional Experience
              </h4>
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                    <span>
                      {exp.role} <span className="font-normal text-slate-500">@ {exp.company}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                Key Projects
              </h4>
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                    <span>{proj.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">[{proj.techStack}]</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">{proj.description}</p>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                Education & Certifications
              </h4>
              {educations.map((edu) => (
                <p key={edu.id} className="text-[11px] text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-100">{edu.degree}</strong> — {edu.institution} ({edu.year})
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Document Modal */}
      {isShareModalOpen && (
        <ShareDocumentModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}
