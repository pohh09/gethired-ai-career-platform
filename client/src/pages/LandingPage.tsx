import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Play,
  Briefcase,
  Bot,
  FileText,
  BarChart3,
  Building2,
  Zap,
  ChevronDown,
  Layers,
  Code2,
  Sun,
  Moon,
  ShieldCheck,
  Cpu,
  Database,
  Server,
  Workflow,
  Globe,
  Layout,
  CheckCircle2,
  FileCode,
  Lock,
  ArrowDown,
} from "lucide-react";
import { useUIStore } from "../store/uiStore";


const PROJECT_CAPABILITIES = [
  {
    title: "Authentication & Protected Routes",
    description:
      "JWT authentication, bcrypt password hashing, token verification middleware, and persistent client-side route guards.",
    icon: Lock,
    color: "text-indigo-500 dark:text-indigo-400",
    bg: "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-900/50",
  },
  {
    title: "AI Career Tools",
    description:
      "Gemini AI integration for ATS resume scoring, STAR bullet rewriting, keyword extraction, and dynamic mock interview simulation.",
    icon: Cpu,
    color: "text-purple-500 dark:text-purple-400",
    bg: "bg-purple-50/70 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-900/50",
  },
  {
    title: "Job Search Integration",
    description:
      "External job API aggregation with multi-parameter filtering, data normalization, deduplication logic, and salary insights.",
    icon: Globe,
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50",
  },
  {
    title: "Application Tracking",
    description:
      "Interactive Kanban board with drag-and-drop stage updates, customizable statuses, notes, reminders, and activity tracking.",
    icon: Layers,
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/50",
  },
];

const PROJECT_HIGHLIGHTS = [
  {
    title: "Full-Stack Architecture",
    description:
      "Built with React, Node.js, Express, and MongoDB, handling RESTful API workflows, JWT authentication, and database persistence.",
    icon: Server,
    color: "text-indigo-500 dark:text-indigo-400",
    bg: "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-900/50",
  },
  {
    title: "AI-Powered Features",
    description:
      "Integrated Gemini AI APIs for ATS resume scoring, STAR bullet rewriting, keyword extraction, and dynamic mock interview evaluation.",
    icon: Cpu,
    color: "text-purple-500 dark:text-purple-400",
    bg: "bg-purple-50/70 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-900/50",
  },
  {
    title: "Production-Style UX",
    description:
      "Modern, responsive interface featuring state management with Zustand & React Query, interactive Kanban boards, and dark mode support.",
    icon: Layout,
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/50",
  },
];


const FEATURES = [
  {
    icon: FileText,
    title: "AI Resume Analyzer",
    description:
      "Analyze resume structure, skills and keywords against target job descriptions.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: Briefcase,
    title: "Job Discovery",
    description:
      "Search and normalize job listings from external providers in one unified interface.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Layers,
    title: "Application Tracker",
    description:
      "Track applications through customizable statuses, notes, reminders and a Kanban workflow.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Zap,
    title: "AI Interview Prep",
    description:
      "Practice HR, behavioral and technical interviews with AI-generated questions and feedback.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Visualize application activity, interview progress and job-search performance.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Building2,
    title: "Company Workspace",
    description:
      "Organize company information, recruiters, notes and hiring activity.",
    color: "from-teal-500 to-emerald-600",
  },
];


const ENGINEERING_HIGHLIGHTS = [
  {
    title: "Authentication",
    description:
      "JWT authentication, protected routes and persistent client-side auth state.",
    icon: ShieldCheck,
  },
  {
    title: "AI Integration",
    description:
      "Integrated AI-powered resume, interview and career assistance workflows.",
    icon: Cpu,
  },
  {
    title: "Job Aggregation",
    description:
      "Integrated external job providers and normalized different API responses.",
    icon: Globe,
  },
  {
    title: "State Management",
    description:
      "Used Zustand and TanStack Query for client and server state management.",
    icon: Workflow,
  },
  {
    title: "File Processing",
    description:
      "Implemented resume upload and parsing workflows.",
    icon: FileCode,
  },
  {
    title: "Analytics",
    description:
      "Built dashboard KPIs, charts and application activity tracking.",
    icon: BarChart3,
  },
];


const TECH_GROUPS = [
  {
    category: "Frontend",
    techs: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "React Router",
      "Zustand",
      "TanStack Query",
      "Framer Motion",
    ],
    color: "border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30",
    badgeColor: "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300",
  },
  {
    category: "Backend",
    techs: ["Node.js", "Express.js", "MongoDB", "Mongoose"],
    color: "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30",
    badgeColor: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300",
  },
  {
    category: "AI & APIs",
    techs: ["Gemini AI", "REST APIs", "External Job APIs"],
    color: "border-purple-200 dark:border-purple-900/60 bg-purple-50/60 dark:bg-purple-950/30",
    badgeColor: "bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300",
  },
  {
    category: "Deployment",
    techs: ["Vercel", "Render"],
    color: "border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30",
    badgeColor: "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300",
  },
];


const ARCHITECTURE_STEPS = [
  {
    step: "01",
    label: "React + TypeScript",
    sub: "Frontend UI & Interactive Components",
    icon: Layout,
  },
  {
    step: "02",
    label: "Axios / TanStack Query",
    sub: "Data Fetching, Caching & Mutations",
    icon: Workflow,
  },
  {
    step: "03",
    label: "Express REST API",
    sub: "Backend Route Handlers & Controllers",
    icon: Server,
  },
  {
    step: "04",
    label: "Authentication + Business Logic",
    sub: "JWT Guards, Password Hashing & Middleware",
    icon: ShieldCheck,
  },
  {
    step: "05",
    label: "MongoDB",
    sub: "Mongoose Schemas & Data Persistence",
    icon: Database,
  },
  {
    step: "06",
    label: "Gemini AI + External Job APIs",
    sub: "Prompt Pipelines & Job Data Normalization",
    icon: Cpu,
  },
];


const SHOWCASE_TABS = [
  {
    id: "dashboard",
    label: "Dashboard",
    title: "Career Command Center",
    desc: "Key application KPIs, interview pipeline, and job activity tracking.",
  },
  {
    id: "ai-workspace",
    label: "AI Workspace",
    title: "AI Resume & Interview Assistant",
    desc: "Interactive workspace with AI resume tailoring and live interview coaching.",
  },
  {
    id: "jobs",
    label: "Discover Jobs",
    title: "Job Search Engine",
    desc: "Multi-provider job search integration with unified filters and fit matching.",
  },
  {
    id: "resume",
    label: "Resume Analysis",
    title: "ATS Optimization Engine",
    desc: "Structural score, STAR bullet rewriting, and missing skill analysis.",
  },
];


const FAQS = [
  {
    q: "Is GetHired a real product?",
    a: "GetHired is a portfolio project built as a production-style full-stack application. It demonstrates authentication, job discovery, AI career tools, application tracking and analytics.",
  },
  {
    q: "Is the data real?",
    a: "Some job listings may come from external APIs. Dashboard metrics and showcase examples use demo data.",
  },
  {
    q: "What technologies were used?",
    a: "React, TypeScript, Node.js, Express, MongoDB, Tailwind CSS, Zustand, TanStack Query, Gemini AI and external APIs.",
  },
  {
    q: "Can I explore the application?",
    a: "Yes. Use the demo flow or create an account to explore the application.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useUIStore();
  const [activeShowcase, setActiveShowcase] = useState("dashboard");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const activeTabObj =
    SHOWCASE_TABS.find((t) => t.id === activeShowcase) || SHOWCASE_TABS[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden">

      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-indigo-500/20">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Get
              <span className="text-indigo-600 dark:text-indigo-400">Hired</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800 ml-1">
              Full-Stack Project
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7 text-xs font-extrabold text-slate-600 dark:text-slate-400">
            <a
              href="#project-overview"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Overview
            </a>
            <a
              href="#problem-solution"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Workflow
            </a>
            <a
              href="#capabilities"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#features"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#engineering"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Engineering
            </a>
            <a
              href="#architecture"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Architecture
            </a>
            <a
              href="#tech-stack"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Tech Stack
            </a>
            <a
              href="#faq"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <span>Explore Demo</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>


      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold border border-indigo-200/80 dark:border-indigo-800 shadow-2xs">
            <Code2 size={14} className="text-indigo-500" />
            <span>Full-Stack MERN + AI Project</span>
          </div>


          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Your Job Search,{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Built Into One Workspace.
            </span>
          </h1>


          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            GetHired is a full-stack job management platform combining job discovery,
            AI resume analysis, interview preparation, and application tracking in
            one workspace.
          </p>


          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Explore GetHired</span>
              <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={() => navigate("/ai-workspace")}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play size={16} className="text-indigo-600 fill-indigo-600" />
              <span>Explore Demo</span>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="GitHub Repository"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 sm:mt-16 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-4 sm:p-6 backdrop-blur-md space-y-4 max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="ml-2 text-xs font-bold text-slate-400 font-mono">
                gethired-workspace.local/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Demo Data
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Application Preview
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                ATS Resume Score
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                94 / 100{" "}
                <span className="text-xs font-bold text-emerald-500">
                  Grade A+
                </span>
              </p>
              <p className="text-[11px] text-slate-500">
                Parsed Skills & STAR Metrics
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Target Role Match
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                92% Match
              </p>
              <p className="text-[11px] text-slate-500">
                Senior Full Stack Developer
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Interview Readiness
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                88% Ready
              </p>
              <p className="text-[11px] text-slate-500">
                TechNova Labs Preparation
              </p>
            </div>
          </div>
        </motion.div>
      </section>


      <section
        id="problem-solution"
        className="py-16 bg-white dark:bg-slate-900/80 border-y border-slate-200/80 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Workflow Optimization
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              One Workspace for the Entire Job Search
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">

            <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-extrabold">
                  <span>Problem</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  "Job seekers often switch between job boards, resume tools, spreadsheets, interview platforms and notes."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Globe size={14} className="text-rose-500" />
                  <span>Job Boards</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <FileText size={14} className="text-rose-500" />
                  <span>Resume Tools</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <BarChart3 size={14} className="text-rose-500" />
                  <span>Spreadsheets</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Zap size={14} className="text-rose-500" />
                  <span>Interview Notes</span>
                </div>
              </div>
            </div>


            <div className="p-6 sm:p-8 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold">
                  <CheckCircle2 size={14} />
                  <span>GetHired Solution</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  "GetHired brings these workflows together into a single workspace."
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/30 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} /> Unified Job Workspace
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
                    Integrated
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 pt-1">
                  <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Job Boards</span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Resume Tools</span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Spreadsheet</span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Interview Prep</span>
                </div>

                <div className="flex items-center justify-center pt-1 text-indigo-600 dark:text-indigo-400">
                  <ArrowDown size={16} className="animate-bounce" />
                </div>

                <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center text-xs font-extrabold shadow-md">
                  GetHired Workspace
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section
        id="capabilities"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            System Overview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Project Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Core technical features and modular systems implemented across the full-stack codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECT_CAPABILITIES.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border ${card.bg} shadow-xs space-y-4 flex flex-col justify-between transition-all hover:shadow-md`}
              >
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 inline-block shadow-xs">
                    <Icon size={22} className={card.color} />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="project-overview"
        className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Portfolio Context
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Built as a Real-World Full-Stack Project
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              GetHired was designed to solve the fragmented job-search workflow by bringing
              job discovery, resume optimization, interview preparation, and application
              tracking into one application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PROJECT_HIGHLIGHTS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 sm:p-8 rounded-3xl border ${card.bg} shadow-xs space-y-4 flex flex-col justify-between bg-white dark:bg-slate-900`}
                >
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 inline-block shadow-xs">
                      <Icon size={24} className={card.color} />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section
        id="showcase"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Interactive Product Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Designed for Speed and Clarity
          </h2>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {SHOWCASE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveShowcase(tab.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${activeShowcase === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTabObj.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-6 max-w-4xl mx-auto overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {activeTabObj.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {activeTabObj.desc}
                </p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                DEMO DATA
              </span>
            </div>


            {activeTabObj.id === "dashboard" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                      Total Tracked
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      42 Jobs
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      Interviews
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      8 Active
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Offers
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      2 Offers
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                      ATS Average
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      94 / 100
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-inner border border-slate-800">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400" /> Upcoming Interview
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100">
                        Senior Full Stack Engineer
                      </h4>
                      <p className="text-xs text-slate-400">
                        TechNova Labs • Technical System Design Round
                      </p>
                    </div>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-3 py-1 rounded-xl border border-indigo-800">
                      Tomorrow @ 10:00 AM
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTabObj.id === "ai-workspace" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Bot size={15} className="text-indigo-500" /> AI Resume Optimizer
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      Score 94%
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">
                        Original:
                      </span>
                      <p className="text-slate-500 line-through font-mono">
                        "Architected microservice endpoints."
                      </p>
                      <span className="text-[10px] text-indigo-500 font-bold block mt-1">
                        STAR Rewritten:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        "Architected high-throughput Node.js microservice APIs, improving throughput by 42%."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 flex flex-col justify-between border border-slate-800 shadow-inner">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      AI Coach Assistant
                    </span>
                    <div className="p-3 rounded-xl bg-slate-800/80 text-xs text-slate-200 border border-slate-700 leading-relaxed font-mono">
                      "I've evaluated your profile against TechNova Labs' Senior Full Stack Engineer posting. You match 94% of core requirements!"
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                      Mock Interview
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
                      Tailor Resume
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTabObj.id === "jobs" && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      TN
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Lead Frontend Engineer
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        TechNova Labs • Hybrid
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      ₹32L - ₹42L LPA
                    </span>
                    <span className="text-[10px] font-bold text-indigo-500">
                      96% Match
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      CP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Senior Full Stack Architect
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        CloudPeak Systems • Remote
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      ₹28L - ₹38L LPA
                    </span>
                    <span className="text-[10px] font-bold text-indigo-500">
                      92% Match
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-850 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      PF
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Backend Systems Engineer
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        PixelForge Labs • Bangalore / Remote
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      ₹24L - ₹34L LPA
                    </span>
                    <span className="text-[10px] font-bold text-indigo-500">
                      89% Match
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTabObj.id === "resume" && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      ATS Scan Compatibility Report
                    </h4>
                    <p className="text-xs text-slate-500">
                      Target Role: Senior Full-Stack Engineer at NovaStack Technologies
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-sm border border-emerald-500/30">
                    94%
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    ✓ React
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    ✓ TypeScript
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    ✓ Node.js
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    + Add Docker
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    + Add GraphQL
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>


      <section
        id="features"
        className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              System Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Core Application Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-2xl bg-gradient-to-tr ${feat.color} text-white inline-block shadow-md`}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>Explore Feature</span>
                    <ArrowRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="engineering"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Technical Implementation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              What I Built Under the Hood
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENGINEERING_HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 inline-block font-extrabold text-xs border border-indigo-200/60 dark:border-indigo-800">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="architecture"
        className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              System Design
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Application Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Designed as a full-stack application with a React frontend, REST API
              backend, MongoDB persistence, AI integrations and external job providers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ARCHITECTURE_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 space-y-2 relative"
                  >
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Icon size={16} />
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {step.step}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {step.sub}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">React + TS</span>
                <span>→</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">Axios / TanStack</span>
                <span>→</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Express REST API</span>
                <span>→</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Auth + Logic</span>
                <span>→</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">MongoDB</span>
                <span>→</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">Gemini AI + Job APIs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="tech-stack"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Technology Stack
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Built With
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {TECH_GROUPS.map((group, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border ${group.color} shadow-xs space-y-3`}
            >
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.techs.map((t, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${group.badgeColor}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      <section
        id="faq"
        className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Project Overview
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-extrabold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${isOpen ? "rotate-180 text-indigo-600" : "text-slate-400"
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>


      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl text-center space-y-6 border border-indigo-900/50">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-indigo-300">
            <Sparkles size={28} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Explore the GetHired Project
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
            Explore the complete application and see how the frontend, backend,
            database, AI integrations and job APIs work together.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/ai-workspace")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/40 hover:scale-105 transition-all cursor-pointer"
            >
              <span>Explore Demo</span>
              <ArrowRight size={18} />
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm border border-white/15 transition-all"
            >
              <span>View GitHub</span>
            </a>
          </div>
        </div>
      </section>


      <footer className="py-8 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold">
            GetHired — Full-Stack MERN + AI Portfolio Project
          </p>
          <div className="flex items-center gap-6 font-bold">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600"
            >
              LinkedIn
            </a>
            <Link to="/ai-workspace" className="hover:text-indigo-600">
              AI Workspace
            </Link>
            <Link to="/login" className="hover:text-indigo-600">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { LandingPage };
