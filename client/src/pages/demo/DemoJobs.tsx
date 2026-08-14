import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Search,
  ExternalLink,
  Bot,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import Button from "../../components/ui/Button";
import { DEMO_JOBS, type DemoJob } from "../../data/demoData";

export default function DemoJobs() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [workplaceFilter, setWorkplaceFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<DemoJob | null>(DEMO_JOBS[0]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const filteredJobs = DEMO_JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWorkplace =
      workplaceFilter === "all" ||
      job.workplaceType.toLowerCase() === workplaceFilter.toLowerCase();

    return matchesSearch && matchesWorkplace;
  });

  const handleApplyClick = () => {
    setShowApplyModal(true);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Briefcase size={22} className="text-indigo-600" />
              <span>Job Discovery Engine</span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200">
                10+ Curated Roles
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Explore live aggregated tech positions with real-time profile match scores and salary benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-400">
              Showing {filteredJobs.length} of {DEMO_JOBS.length} jobs
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company (e.g. Stripe, Razorpay), tech stack (e.g. React, Node)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={workplaceFilter}
              onChange={(e) => setWorkplaceFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Workplace Types (Remote, Hybrid, On-site)</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid Only</option>
              <option value="on-site">On-site Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-3">
          {filteredJobs.map((job) => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-3 select-none ${
                  isSelected
                    ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/30"
                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-11 w-11 rounded-xl text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${job.color}`}
                    >
                      {job.logo}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {job.company} • {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block">
                      {job.matchScore}% Match
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {job.postedDate}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                    {job.workplaceType}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                    {job.salary}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
                    {job.experience}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {job.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-medium border border-slate-200 dark:border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {selectedJob && (
          <div className="lg:col-span-6 sticky top-4 p-5 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`h-12 w-12 rounded-2xl text-white flex items-center justify-center font-black text-base shrink-0 shadow-md ${selectedJob.color}`}
                >
                  {selectedJob.logo}
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                    {selectedJob.company} • {selectedJob.location} • {selectedJob.workplaceType}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 block">
                  {selectedJob.matchScore}% Match
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compensation</span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5 truncate">{selectedJob.salary}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 block mt-0.5">{selectedJob.experience}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Job Type</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 block mt-0.5">{selectedJob.type}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Role Overview
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {selectedJob.description}
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Key Requirements
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {selectedJob.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={handleApplyClick}
                leftIcon={<ExternalLink size={15} />}
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 w-full"
              >
                Sign up to Apply
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => navigate("/demo/ai-workspace?tab=jobs")}
                leftIcon={<Bot size={15} />}
                className="w-full"
              >
                AI Fit Match
              </Button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 text-center space-y-4 z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-800">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                Demo Mode Notice
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                You're exploring GetHired in Demo Mode with sample job listings. Create a free account to track live applications, generate AI tailored cover letters, and unlock automated status synchronization.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/register"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all block text-center"
                >
                  Create Free Account
                </Link>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Continue Exploring Demo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
