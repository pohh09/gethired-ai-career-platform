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
  Target,
  ChevronDown,
  Layers,
  Code,
  Award,
  Sun,
  Moon,
  Star,
} from "lucide-react";
import { useUIStore } from "../store/uiStore";

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "Senior Frontend Engineer",
    company: "Razorpay",
    avatar: "https://ui-avatars.com/api/?name=Aarav+Sharma&background=6366f1&color=fff",
    quote: "GetHired's ATS resume score and instant STAR bullet rewriter helped me land 5 senior engineer interviews within two weeks in Bangalore.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Full Stack Architect",
    company: "Swiggy",
    avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=8b5cf6&color=fff",
    quote: "The India-first job aggregator combined with the AI Mock Interview simulator gave me the confidence to secure a 42% CTC hike.",
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    role: "Product Tech Lead",
    company: "Stripe",
    avatar: "https://ui-avatars.com/api/?name=Rohan+Mehta&background=10b981&color=fff",
    quote: "The Kanban tracking board, auto-generated cover letters, and company CRM replaced 3 separate tools for my entire job hunt.",
    rating: 5,
  },
];

const STATS = [
  {
    label: "Jobs Indexed",
    value: "85,000+",
    icon: Briefcase,
    color: "text-indigo-500",
  },
  {
    label: "AI Analyses Completed",
    value: "150,000+",
    icon: Sparkles,
    color: "text-purple-500",
  },
  {
    label: "Applications Tracked",
    value: "40,000+",
    icon: Target,
    color: "text-emerald-500",
  },
  {
    label: "Resume Callback Boost",
    value: "94%",
    icon: Award,
    color: "text-amber-500",
  },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI Career Operating System",
    description:
      "Single intelligent workspace combining resume tailoring, interview prep, and career roadmaps.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: Briefcase,
    title: "India-First Job Engine",
    description:
      "Unified search across Jooble, JSearch, and Adzuna with multi-field deduplication and term expansion.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: FileText,
    title: "ATS Resume Analyzer",
    description:
      "Extract contact details, compute ATS compatibility (0-100), and optimize bullets using STAR method.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Target,
    title: "AI Job Fit Matching",
    description:
      "Compare your resume against any job description to discover exact missing skills and salary estimates.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Zap,
    title: "Mock Interview Simulator",
    description:
      "Practice HR, Technical, and Behavioral rounds with live AI feedback on Confidence, Accuracy, and Tone.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Layers,
    title: "Kanban Application Tracker",
    description:
      "Interactive drag-and-drop board tracking applications from Saved to Offer with reminders and notes.",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: BarChart3,
    title: "Executive Analytics",
    description:
      "Real-time charts tracking response rates, interview conversion, salary benchmarks, and skill progress.",
    color: "from-indigo-600 to-blue-600",
  },
  {
    icon: Building2,
    title: "Company Workspace Intel",
    description:
      "Deep dive into company tech stacks, hiring processes, salary ranges, benefits, and news.",
    color: "from-teal-500 to-emerald-600",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Upload Resume",
    desc: "Upload your PDF/DOCX resume for automated ATS parsing and skill extraction.",
  },
  {
    step: "02",
    title: "Discover India-First Jobs",
    desc: "Search across top aggregators with intelligent query expansion.",
  },
  {
    step: "03",
    title: "AI Fit Match",
    desc: "Compare your profile against target postings and get missing skill callouts.",
  },
  {
    step: "04",
    title: "One-Click Track",
    desc: "Organize applications on your interactive drag-and-drop Kanban board.",
  },
  {
    step: "05",
    title: "AI Interview Prep",
    desc: "Practice mock interview rounds with live feedback on technical accuracy.",
  },
  {
    step: "06",
    title: "Get Hired",
    desc: "Secure your dream job offer with confidence and benchmarked compensation.",
  },
];

const SHOWCASE_TABS = [
  {
    id: "dashboard",
    label: "Dashboard",
    title: "Career Command Center",
    desc: "Executive KPI widgets, today's tasks, and upcoming interview schedules.",
  },
  {
    id: "ai-workspace",
    label: "AI Workspace",
    title: "AI Operating System",
    desc: "70/30 split layout with 4 core modules and sticky context-aware AI Coach.",
  },
  {
    id: "jobs",
    label: "Discover Jobs",
    title: "India-First Job Engine",
    desc: "Jooble & JSearch multi-provider search with deduplication and filters.",
  },
  {
    id: "resume",
    label: "Resume Analysis",
    title: "ATS Optimization Engine",
    desc: "Structural score, STAR bullet rewriting, and tailored keyword injections.",
  },
];

const TECH_STACK = [
  { name: "React 19", desc: "Modern UI Framework" },
  { name: "TypeScript", desc: "Type Safety" },
  { name: "Node.js & Express", desc: "Scalable API Server" },
  { name: "MongoDB", desc: "NoSQL Database" },
  { name: "Gemini AI", desc: "Generative Intelligence" },
  { name: "Tailwind CSS", desc: "Design System" },
  { name: "Framer Motion", desc: "Smooth Animations" },
];

const FAQS = [
  {
    q: "What makes GetHired different from traditional job boards?",
    a: "GetHired combines multi-provider job search with an interactive AI Career Operating System that tailors your resume, calculates ATS match scores, simulates live mock interviews, and tracks applications on a Kanban board in one unified workspace.",
  },
  {
    q: "How does the AI Resume Tailoring work?",
    a: "Our AI parses your resume text and compares it against target job descriptions to calculate an overall fit score (0-100), identify missing keywords, and suggest STAR-formatted metric achievements.",
  },
  {
    q: "Is GetHired tailored for Indian job seekers?",
    a: "Yes! Discover Jobs incorporates Jooble India as its primary engine alongside JSearch and Adzuna, delivering India-first job listings across Bangalore, Mumbai, Delhi NCR, and remote hubs.",
  },
  {
    q: "Can I try GetHired for free?",
    a: "Absolutely! You can sign up and access the AI Workspace, Application Tracker, and Job Search Engine instantly without any hidden fees.",
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
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-extrabold text-slate-600 dark:text-slate-400">
            <a
              href="#features"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#showcase"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Showcase
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
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
              <span>Get Started</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold border border-indigo-200/80 dark:border-indigo-800 shadow-2xs">
            <Sparkles size={14} className="text-indigo-500 animate-pulse" />
            <span>AI Career Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Accelerate Your Job Search with{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Discover India-first jobs, tailor resumes with ATS scoring, practice
            live mock interviews, and track applications on an interactive
            Kanban board.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={() => navigate("/ai-workspace")}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play size={16} className="text-indigo-600 fill-indigo-600" />
              <span>Explore Live Workspace Demo</span>
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
              <span className="ml-2 text-xs font-bold text-slate-400">
                gethired.ai/dashboard
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Live Preview
            </span>
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
                Greenhouse & Lever Compliant
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
                3 Mock Rounds Completed
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-12 bg-white/80 dark:bg-slate-900/80 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-4 space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs">
                    <Icon size={24} className={stat.color} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Everything You Need
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Complete Toolkit for Job Seekers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            From discovering Indian tech jobs to passing technical interviews,
            GetHired powers your entire job search journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </section>

      <section
        id="how-it-works"
        className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple Step-by-Step
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              How GetHired Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden"
              >
                <span className="text-3xl font-extrabold text-indigo-600/20 dark:text-indigo-400/20 absolute top-4 right-4">
                  {s.step}
                </span>
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 inline-block font-extrabold text-xs border border-indigo-200/60 dark:border-indigo-800">
                  Step {s.step}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {s.desc}
                </p>
              </div>
            ))}
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
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeShowcase === tab.id
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
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Interactive SaaS Preview
              </span>
            </div>

            {/* TAB MOCKUP 1: DASHBOARD */}
            {activeTabObj.id === "dashboard" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Total Tracked</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">42 Jobs</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Interviews</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">8 Active</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Offers</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">2 Offers</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">ATS Average</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">94 / 100</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-inner border border-slate-800">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400" /> Upcoming Interview
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">Confirmed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100">Senior React Engineer</h4>
                      <p className="text-xs text-slate-400">Stripe • Technical System Design Round</p>
                    </div>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-3 py-1 rounded-xl border border-indigo-800">Tomorrow @ 10:00 AM</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB MOCKUP 2: AI WORKSPACE */}
            {activeTabObj.id === "ai-workspace" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Bot size={15} className="text-indigo-500" /> AI Resume Optimizer
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Score 94%</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">Original:</span>
                      <p className="text-slate-500 line-through font-mono">"Architected microservice endpoints."</p>
                      <span className="text-[10px] text-indigo-500 font-bold block mt-1">STAR Rewritten:</span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">"Architected high-throughput Node.js microservice APIs, improving throughput by 42%."</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 flex flex-col justify-between border border-slate-800 shadow-inner">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">AI Coach Live Assistant</span>
                    <div className="p-3 rounded-xl bg-slate-800/80 text-xs text-slate-200 border border-slate-700 leading-relaxed font-mono">
                      "I've evaluated your profile against Stripe's Senior Frontend Engineer posting. You match 94% of core technical requirements!"
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">Mock Interview</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">Tailor Resume</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB MOCKUP 3: DISCOVER JOBS */}
            {activeTabObj.id === "jobs" && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">RZ</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Lead Frontend Engineer</h4>
                      <p className="text-[11px] text-slate-500">Razorpay • Bangalore, India (Hybrid)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">₹32L - ₹42L LPA</span>
                    <span className="text-[10px] font-bold text-indigo-500">96% Match</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">SW</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Senior Full Stack Architect</h4>
                      <p className="text-[11px] text-slate-500">Swiggy • Remote India</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">₹28L - ₹38L LPA</span>
                    <span className="text-[10px] font-bold text-indigo-500">92% Match</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB MOCKUP 4: RESUME ANALYSIS */}
            {activeTabObj.id === "resume" && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">ATS Scan Compatibility Report</h4>
                    <p className="text-xs text-slate-500">Scanned against 50+ enterprise HR ATS parameters</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-sm border border-emerald-500/30">
                    94%
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">✓ React 19</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">✓ TypeScript</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">+ Add Docker</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">+ Add GraphQL</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Loved by Job Seekers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Loved by Tech Professionals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            See how GetHired helps engineers, designers, and managers land high-growth tech roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {item.role} @ <span className="font-semibold text-slate-700 dark:text-slate-300">{item.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Powered by Modern Full-Stack Technologies
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Built for speed, reliability, and security.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {TECH_STACK.map((tech, idx) => (
              <div
                key={idx}
                className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-2"
              >
                <Code size={15} className="text-indigo-500" />
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    {tech.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Got Questions? We Have Answers.
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
                  className="w-full p-5 text-left flex items-center justify-between font-extrabold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${isOpen ? "rotate-180 text-indigo-600" : "text-slate-400"}`}
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
            Ready to Supercharge Your Career Growth?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
            Join thousands of job seekers optimizing resumes, discovering Indian
            tech opportunities, and conquering technical interviews.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/40 hover:scale-105 transition-all"
            >
              <span>Get Started with GetHired</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} GetHired AI Career Platform. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6 font-bold">
            <Link to="/landing" className="hover:text-indigo-600">
              Privacy Policy
            </Link>
            <Link to="/landing" className="hover:text-indigo-600">
              Terms of Service
            </Link>
            <Link to="/ai-workspace" className="hover:text-indigo-600">
              AI Workspace
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { LandingPage };
