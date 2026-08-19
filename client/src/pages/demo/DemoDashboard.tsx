import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Layers,
  Award,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  DollarSign,
  Bot,
  Zap,
  Target,
  FileText,
} from "lucide-react";
import Button from "../../components/ui/Button";
import {
  DEMO_USER,
  DEMO_METRICS,
  DEMO_UPCOMING_INTERVIEWS,
  DEMO_APPLICATIONS,
} from "../../data/demoData";

export default function DemoDashboard() {
  const navigate = useNavigate();

  const recentApplications = DEMO_APPLICATIONS.slice(0, 5);

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles size={12} className="text-cyan-400" />
            Executive Career Command Center
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, {DEMO_USER.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
            You have <strong className="text-amber-400">8 active interview processes</strong> and <strong className="text-emerald-400">2 formal job offers</strong>. Next interview with <strong className="text-cyan-300">Stripe</strong> is scheduled for tomorrow at 10:00 AM.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/demo/ai-workspace")}
            leftIcon={<Bot size={16} />}
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 w-full sm:w-auto"
          >
            Open AI Workspace
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate("/demo/jobs")}
            leftIcon={<Briefcase size={16} />}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full sm:w-auto"
          >
            Explore Jobs (10+)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tracked</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400">
              <Briefcase size={14} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 block">
            {DEMO_METRICS.totalApplications}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp size={11} /> +6 this week
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Interviews</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
              <Clock size={14} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 block">
            {DEMO_METRICS.activeInterviews}
          </span>
          <span className="text-[10px] text-amber-600 font-bold">4 scheduled</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Offers</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <Award size={14} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 block">
            {DEMO_METRICS.offersReceived}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">₹76L max pkg</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Conversion</span>
            <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600">
              <Target size={14} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 block">
            {DEMO_METRICS.conversionRate}%
          </span>
          <span className="text-[10px] text-cyan-600 font-bold">Top 5% candidate</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Response</span>
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600">
              <Zap size={14} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 block">
            {DEMO_METRICS.avgResponseDays}d
          </span>
          <span className="text-[10px] text-sky-600 font-bold">Fast response</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pipeline Val</span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600">
              <DollarSign size={14} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 block">
            ₹68L
          </span>
          <span className="text-[10px] text-teal-600 font-bold">Median package</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Upcoming Interview Pipeline
                  </h3>
                  <p className="text-xs text-slate-500">
                    4 interviews confirmed across Stripe, Razorpay, Google, and Swiggy
                  </p>
                </div>
              </div>
              <Link
                to="/demo/calendar"
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {DEMO_UPCOMING_INTERVIEWS.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-cyan-700 transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`h-10 w-10 rounded-xl text-white flex items-center justify-center font-bold text-xs shrink-0 ${item.color}`}
                    >
                      {item.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
                          {item.company}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
                        {item.role}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Round: <strong className="text-slate-700 dark:text-slate-300">{item.type}</strong> • {item.interviewer}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-cyan-800">
                      {item.date} @ {item.time}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate("/demo/ai-workspace?tab=interview")}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1"
                    >
                      <Bot size={13} />
                      <span>Prepare Round</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Active Application Pipeline
                  </h3>
                  <p className="text-xs text-slate-500">
                    Drag and drop cards in the interactive Kanban tracker
                  </p>
                </div>
              </div>
              <Link
                to="/demo/applications"
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View Kanban Board</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-3 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shrink-0 ${app.color}`}
                    >
                      {app.logo}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
                        {app.role}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {app.company} • {app.location} • {app.salary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        app.status === "offer"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : app.status === "interview"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : app.status === "applied"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {app.status}
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 hidden sm:inline-block">
                      {app.matchScore}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  AI Resume Intelligence
                </h3>
                <p className="text-[11px] text-slate-500">Alex_Johnson_Resume.pdf</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-blue-700 dark:text-cyan-300 uppercase tracking-wider block">
                ATS Compatibility Score
              </span>
              <span className="text-4xl font-black text-slate-900 dark:text-slate-100 block">
                94 / 100
              </span>
              <span className="text-xs font-bold text-emerald-600">Grade A+ (Highly Competitive)</span>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Top Detected Keywords:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["React 19", "TypeScript", "Next.js", "Node.js", "GraphQL", "Redis", "AWS", "Zustand"].map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Recommended Improvements:
              </span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 font-medium">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Add Docker containerization experience</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Quantify backend latency reduction metrics</span>
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/demo/ai-workspace?tab=resume")}
              leftIcon={<FileText size={14} />}
              className="w-full"
            >
              Full ATS Audit Report
            </Button>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Zap size={16} className="text-amber-500" />
              Quick Demo Workflows
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate("/demo/ai-workspace?tab=resume")}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-left hover:border-cyan-500 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    STAR Bullet Transformation
                  </h4>
                  <p className="text-[11px] text-slate-500">Rewrite resume bullets with metric impact</p>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/demo/ai-workspace?tab=jobs")}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-left hover:border-cyan-500 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    JD Match Fit Analysis
                  </h4>
                  <p className="text-[11px] text-slate-500">Calculate profile match against Stripe JD</p>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/demo/ai-workspace?tab=interview")}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-left hover:border-cyan-500 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Mock Interview Simulator
                  </h4>
                  <p className="text-[11px] text-slate-500">12-question technical and system design round</p>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/demo/ai-workspace?tab=career")}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-left hover:border-cyan-500 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Staff Engineer Growth Roadmap
                  </h4>
                  <p className="text-[11px] text-slate-500">6-month career progression roadmap</p>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
