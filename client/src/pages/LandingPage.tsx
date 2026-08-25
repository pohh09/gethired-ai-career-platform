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
  Menu,
  X,
  Users,
  Flame,
  HelpCircle,
} from "lucide-react";
import { useUIStore } from "../store/uiStore";
import GetHiredLogo from "../components/common/GetHiredLogo";

const PROJECT_CAPABILITIES = [
  {
    title: "Authentication & Security",
    description:
      "JWT authentication, bcrypt password hashing, token verification middleware, and persistent client-side route guards.",
    icon: Lock,
    color: "text-blue-600 dark:text-cyan-400",
    bg: "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50",
  },
  {
    title: "AI Career Tools",
    description:
      "Gemini AI integration for ATS resume scoring, STAR bullet rewriting, keyword extraction, and dynamic mock interview simulation.",
    icon: Cpu,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-200/80 dark:border-cyan-900/50",
  },
  {
    title: "Peer Community & Streaks",
    description:
      "Privacy-first peer feedback on drafts, daily accountability streak tracker, celebration win feeds, and candidate Q&A.",
    icon: Users,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-900/50",
  },
  {
    title: "Application Tracking",
    description:
      "Interactive Kanban board with drag-and-drop stage updates, customizable statuses, notes, reminders, and activity tracking.",
    icon: Layers,
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50",
  },
];

const FEATURES = [
  {
    icon: FileText,
    title: "AI Resume Analyzer",
    description:
      "Analyze resume structure, skills and keywords against target job descriptions.",
    color: "from-blue-600 via-sky-500 to-cyan-500",
  },
  {
    icon: Briefcase,
    title: "Job Discovery",
    description:
      "Search and normalize job listings from external providers in one unified interface.",
    color: "from-sky-500 to-blue-600",
  },
  {
    icon: Users,
    title: "Peer Review & Streaks",
    description:
      "Get section-by-section draft feedback, track daily search momentum, and celebrate offer wins.",
    color: "from-indigo-600 via-purple-500 to-pink-500",
  },
  {
    icon: Layers,
    title: "Application Tracker",
    description:
      "Track applications through customizable statuses, notes, reminders and a Kanban workflow.",
    color: "from-cyan-500 via-sky-600 to-blue-700",
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
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "React Router",
      "Zustand",
      "TanStack Query",
      "Framer Motion",
    ],
    color: "border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30",
    badgeColor: "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-cyan-300",
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
    color: "border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/60 dark:bg-cyan-950/30",
    badgeColor: "bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300",
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
    id: "community",
    label: "Community & Peer Feedback",
    title: "Peer Reviews & Streak Cohorts",
    desc: "Privacy-first draft reviews, daily momentum streaks, and celebration feed.",
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
    a: "GetHired is a full-stack career platform built as a production-grade application. It demonstrates authentication, job discovery, AI career tools, peer feedback, application tracking, and analytics.",
  },
  {
    q: "Is the peer feedback feature private by default?",
    a: "Yes! All resume and cover letter drafts default to private. Users must actively opt in by toggling visibility to 'Open for Peer Feedback' to receive suggestions.",
  },
  {
    q: "What technologies were used?",
    a: "React 19, TypeScript, Node.js, Express, MongoDB, Tailwind CSS, Zustand, TanStack Query, Gemini AI, and external job aggregators.",
  },
  {
    q: "Can I explore the application without signing up?",
    a: "Yes. You can click 'Explore Demo' to experience the full interactive dashboard and AI workflows with pre-populated demo data.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useUIStore();
  const [activeShowcase, setActiveShowcase] = useState("dashboard");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTabObj =
    SHOWCASE_TABS.find((t) => t.id === activeShowcase) || SHOWCASE_TABS[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="w-[94%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
            <GetHiredLogo size={36} showBadge badgeText="Full-Stack" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-extrabold text-slate-600 dark:text-slate-400">
            <a
              href="#features"
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#capabilities"
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#architecture"
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              Architecture
            </a>
            <a
              href="#tech-stack"
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              Tech Stack
            </a>
            <a
              href="#faq"
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Desktop CTA & Theme Controls */}
          <div className="hidden sm:flex items-center gap-2.5 sm:gap-3 shrink-0">
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
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/demo"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all"
            >
              <span>Explore Demo</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex sm:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link
              to="/demo"
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-extrabold shadow-xs flex items-center gap-1"
            >
              <Play size={11} className="fill-white" />
              <span>Demo</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
              aria-label="Open mobile navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4 space-y-4 shadow-xl overflow-hidden"
            >
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      Explore Interactive Demo
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      No sign-up needed • Full test drive
                    </p>
                  </div>
                </div>
                <Link
                  to="/demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shrink-0 shadow-xs"
                >
                  Launch →
                </Link>
              </div>

              <nav className="flex flex-col space-y-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <Sparkles size={15} className="text-blue-500" />
                  <span>Features & Modules</span>
                </a>
                <a
                  href="#capabilities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <Cpu size={15} className="text-cyan-500" />
                  <span>System Capabilities</span>
                </a>
                <a
                  href="#architecture"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <Workflow size={15} className="text-indigo-500" />
                  <span>Architecture & Design</span>
                </a>
                <a
                  href="#tech-stack"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <FileCode size={15} className="text-emerald-500" />
                  <span>Tech Stack</span>
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <HelpCircle size={15} className="text-amber-500" />
                  <span>Frequently Asked Questions</span>
                </a>
              </nav>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Sign In to Account
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4">
        <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 text-[11px] sm:text-xs font-extrabold border border-blue-200/80 dark:border-cyan-800 shadow-2xs">
            <Code2 size={13} className="text-cyan-500" />
            <span>Full-Stack Career Platform + AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight px-1">
            Your Job Search,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent block sm:inline">
              Built Into One Workspace.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto px-2">
            GetHired unites job search discovery, AI resume scoring, mock interview practice, peer feedback, and application tracking in one unified interface.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md mx-auto sm:max-w-none">
            <Link
              to="/register"
              className="w-full sm:w-auto justify-center px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Explore GetHired</span>
              <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={() => navigate("/demo")}
              className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm shadow-md hover:bg-sky-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play size={16} className="text-blue-600 fill-blue-600" />
              <span>Explore Interactive Demo</span>
            </button>
          </div>
        </div>

        {/* Hero Interactive Terminal Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 sm:mt-14 md:mt-16 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-md space-y-4 w-full max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs font-bold text-slate-400 font-mono truncate max-w-[160px] sm:max-w-none">
                gethired-workspace.local/dashboard
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Demo Data
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                Application Preview
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400 block">
                ATS Resume Score
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                94 / 100{" "}
                <span className="text-xs font-bold text-emerald-500">
                  Grade A+
                </span>
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                Parsed Skills & STAR Metrics
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Target Role Match
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                92% Match
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                Senior Full Stack Developer
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/50 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 block">
                Interview Readiness
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                88% Ready
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                TechNova Labs Preparation
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problem vs Solution Section */}
      <section
        id="problem-solution"
        className="py-12 sm:py-16 bg-white dark:bg-slate-900/80 border-y border-slate-200/80 dark:border-slate-800"
      >
        <div className="w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4 space-y-8 sm:space-y-12">
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Workflow Optimization
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              One Workspace for the Entire Job Search
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch w-full max-w-6xl mx-auto">
            {/* Problem Card */}
            <div className="p-5 sm:p-8 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-extrabold">
                  <span>The Fragmented Problem</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  "Job seekers juggle disconnected job boards, resume generators, complex spreadsheets, interview notes, and feel isolated during search fatigue."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-2">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Globe size={14} className="text-rose-500 shrink-0" />
                  <span className="truncate">Job Boards</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <FileText size={14} className="text-rose-500 shrink-0" />
                  <span className="truncate">Resume Tools</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <BarChart3 size={14} className="text-rose-500 shrink-0" />
                  <span className="truncate">Spreadsheets</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Zap size={14} className="text-rose-500 shrink-0" />
                  <span className="truncate">Interview Notes</span>
                </div>
              </div>
            </div>

            {/* Solution Card */}
            <div className="p-5 sm:p-8 rounded-3xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-cyan-300 text-xs font-extrabold">
                  <CheckCircle2 size={14} />
                  <span>The GetHired Solution</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  "GetHired brings job hunting, AI resume optimization, mock interviews, and peer accountability together into a unified operating system."
                </p>
              </div>

              <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-xs font-extrabold text-blue-600 dark:text-cyan-400">
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <Sparkles size={15} /> Unified Career Hub
                  </span>
                  <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                    Integrated
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-bold text-slate-600 dark:text-slate-300 pt-1">
                  <span className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">Jobs</span>
                  <span className="hidden sm:inline">→</span>
                  <span className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">AI Resume</span>
                  <span className="hidden sm:inline">→</span>
                  <span className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">Kanban</span>
                  <span className="hidden sm:inline">→</span>
                  <span className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">Community</span>
                </div>

                <div className="flex items-center justify-center pt-1 text-blue-600 dark:text-cyan-400">
                  <ArrowDown size={15} className="animate-bounce" />
                </div>

                <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white text-center text-xs font-extrabold shadow-md">
                  GetHired Operating Workspace
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section
        id="capabilities"
        className="py-14 sm:py-20 w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4 space-y-8 sm:space-y-12"
      >
        <div className="text-center space-y-2.5 max-w-3xl mx-auto">
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            System Overview
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Project Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Core technical systems and modular capabilities implemented across the full-stack codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PROJECT_CAPABILITIES.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-5 sm:p-6 rounded-3xl border ${card.bg} shadow-xs space-y-3.5 flex flex-col justify-between transition-all hover:shadow-md`}
              >
                <div className="space-y-2.5">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 inline-block shadow-xs">
                    <Icon size={20} className={card.color} />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
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

      {/* Interactive Showcase Preview */}
      <section
        id="showcase"
        className="py-14 sm:py-20 w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4 space-y-8 sm:space-y-10"
      >
        <div className="text-center space-y-2.5 max-w-3xl mx-auto">
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            Interactive Product Preview
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Designed for Speed and Clarity
          </h2>
        </div>

        {/* Scrollable / Responsive Showcase Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
          {SHOWCASE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveShowcase(tab.id)}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeShowcase === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-800"
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
            className="p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-5 sm:space-y-6 w-full max-w-5xl mx-auto overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {activeTabObj.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {activeTabObj.desc}
                </p>
              </div>
              <span className="self-start sm:self-auto text-[10px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                LIVE DEMO PREVIEW
              </span>
            </div>

            {/* Dashboard Showcase */}
            {activeTabObj.id === "dashboard" && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                    <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block">
                      Total Tracked
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      42 Jobs
                    </span>
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                    <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      Interviews
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      8 Active
                    </span>
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Offers
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      2 Offers
                    </span>
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40">
                    <span className="text-[9px] sm:text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                      ATS Average
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      94 / 100
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 shadow-inner border border-slate-800">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px] sm:text-xs">
                      <Sparkles size={13} className="text-cyan-400 shrink-0" /> Upcoming Interview
                    </span>
                    <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-100">
                        Senior Full Stack Engineer
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        TechNova Labs • Technical System Design Round
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 bg-blue-950 px-2.5 py-1 rounded-xl border border-blue-800 self-start sm:self-auto">
                      Tomorrow @ 10:00 AM
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Community Showcase */}
            {activeTabObj.id === "community" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Users size={15} className="text-indigo-500" /> Peer Review & Suggestions
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      5 Helpful Upvotes
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Feedback from Sarah (Hiring Manager):
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "Quantified metrics in your experience section look strong! Consider adding the team size mentored."
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 flex flex-col justify-between border border-slate-800 shadow-inner">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <Flame size={14} className="fill-amber-400" /> 4 Day Daily Streak
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                        Cohort Rank #4
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      "Liam just celebrated landing an offer at Datadog! 18 community members congratulated."
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
                      🎉 Offer Landed
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                      💬 Q&A Active
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Workspace Showcase */}
            {activeTabObj.id === "ai-workspace" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Bot size={15} className="text-blue-500" /> AI Resume Optimizer
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
                      <p className="text-slate-500 line-through font-mono text-[11px]">
                        "Architected microservice endpoints."
                      </p>
                      <span className="text-[10px] text-blue-500 dark:text-cyan-400 font-bold block mt-1">
                        STAR Rewritten:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium text-[11px]">
                        "Architected high-throughput Node.js microservice APIs, boosting query speed by 42%."
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
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-600/30 text-cyan-300 border border-cyan-500/30">
                      Mock Interview
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
                      Tailor Resume
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Showcase */}
            {activeTabObj.id === "jobs" && (
              <div className="space-y-2.5 sm:space-y-3">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                      TN
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        Lead Frontend Engineer
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                        TechNova Labs • Hybrid
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      ₹32L - ₹42L LPA
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">
                      96% Match
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                      CP
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        Senior Full Stack Architect
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                        CloudPeak Systems • Remote
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      ₹28L - ₹38L LPA
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">
                      92% Match
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Resume Showcase */}
            {activeTabObj.id === "resume" && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      ATS Scan Compatibility Report
                    </h4>
                    <p className="text-[10px] sm:text-xs text-slate-500">
                      Target Role: Senior Full-Stack Engineer
                    </p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-xs sm:text-sm border border-emerald-500/30 shrink-0">
                    94%
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    ✓ React 19
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    ✓ TypeScript
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    ✓ Node.js / Express
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    + Add Docker
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="py-14 sm:py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800"
      >
        <div className="w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4 space-y-8 sm:space-y-12">
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              System Features
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Core Application Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="group p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-xl transition-all space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div
                      className={`p-2.5 sm:p-3 rounded-2xl bg-gradient-to-tr ${feat.color} text-white inline-block shadow-md`}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {feat.description}
                    </p>
                  </div>

                  <Link
                    to="/login"
                    className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-cyan-400 group-hover:text-blue-500 transition-colors"
                  >
                    <span>Sign in to try this</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Engineering Under the Hood */}
      <section
        id="engineering"
        className="py-14 sm:py-20 w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4 space-y-8 sm:space-y-12"
      >
        <div className="w-full mx-auto space-y-8 sm:space-y-12">
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Technical Implementation
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              What I Built Under the Hood
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ENGINEERING_HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5"
                >
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 inline-block font-extrabold text-xs border border-blue-200/60 dark:border-cyan-800">
                    <Icon size={17} />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
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

      {/* System Architecture */}
      <section
        id="architecture"
        className="py-14 sm:py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800"
      >
        <div className="w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4 space-y-8 sm:space-y-12">
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              System Design
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Application Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Designed as a modern full-stack platform with a React frontend, REST API backend, MongoDB persistence, AI integrations and external job providers.
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {ARCHITECTURE_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-2 relative hover:border-blue-500/40 dark:hover:border-cyan-500/40 transition-all duration-200 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 border border-blue-100 dark:border-blue-900/60 shadow-2xs">
                        <Icon size={16} />
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                        STEP {step.step}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {step.sub}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Architecture Pipeline Flow Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/90 dark:border-slate-800 text-center overflow-x-auto no-scrollbar">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 min-w-max">
                <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200/80 dark:border-blue-800/60 shadow-2xs">
                  React 19 + TS
                </span>
                <span className="text-slate-400 dark:text-slate-600 font-black">→</span>
                <span className="px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 shadow-2xs">
                  TanStack / Axios
                </span>
                <span className="text-slate-400 dark:text-slate-600 font-black">→</span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
                  Express REST
                </span>
                <span className="text-slate-400 dark:text-slate-600 font-black">→</span>
                <span className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 shadow-2xs">
                  JWT Guards
                </span>
                <span className="text-slate-400 dark:text-slate-600 font-black">→</span>
                <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 shadow-2xs">
                  MongoDB Atlas
                </span>
                <span className="text-slate-400 dark:text-slate-600 font-black">→</span>
                <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 shadow-2xs">
                  Gemini 1.5 Flash
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section
        id="tech-stack"
        className="py-14 sm:py-20 w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4 space-y-6 sm:space-y-8"
      >
        <div className="text-center space-y-2">
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            Technology Stack
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Built With Modern Tech
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full mx-auto">
          {TECH_GROUPS.map((group, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-3xl border ${group.color} shadow-xs space-y-2.5`}
            >
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {group.techs.map((t, i) => (
                  <span
                    key={i}
                    className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-xl ${group.badgeColor}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-14 sm:py-20 w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4 space-y-6 sm:space-y-8"
      >
        <div className="text-center space-y-2.5 max-w-3xl mx-auto">
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            Project Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
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
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer gap-2"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={17}
                    className={`transition-transform shrink-0 ${
                      isOpen ? "rotate-180 text-cyan-500" : "text-slate-400"
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-20 w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4">
        <div className="p-6 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl text-center space-y-4 sm:space-y-6 border border-blue-900/50">
          <div className="inline-flex p-2.5 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-cyan-300">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Explore the GetHired Platform
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience the complete career operating system with AI resume optimization, peer feedback, mock interview practice, and Kanban tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-sm mx-auto sm:max-w-none">
            <button
              type="button"
              onClick={() => navigate("/demo")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/40 hover:scale-105 transition-all cursor-pointer"
            >
              <span>Explore Demo Mode</span>
              <ArrowRight size={17} />
            </button>
            <a
              href="https://github.com/pooj0901/gethired"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm border border-white/15 transition-all"
            >
              <span>View GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="w-[92%] sm:w-[90%] max-w-[1750px] mx-auto px-1 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-xs">
            GetHired — Full-Stack AI Career Operating Platform
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-bold text-xs">
            <a
              href="https://github.com/pooj0901/gethired"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <Link to="/demo/ai-workspace" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
              AI Workspace
            </Link>
            <Link to="/login" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { LandingPage };
