import { useState } from "react";
import {
  TrendingUp,
  Target,
  Sparkles,
  Calendar,
  Award,
  BookOpen,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../ui/Button";
import Select from "../../ui/Select";
import { useResumeStore } from "../../../store/resumeStore";
import * as aiService from "../../../services/aiWorkspaceService";

const COMMON_ROLES = [
  "Frontend Developer",
  "Senior Frontend Engineer",
  "Backend Engineer",
  "Senior Backend Engineer",
  "Full Stack Developer",
  "Senior Full Stack Developer",
  "DevOps Engineer",
  "Cloud Architect",
  "Staff Software Engineer",
  "Principal Architect",
  "Engineering Director",
  "VP of Engineering",
];

const DEFAULT_SKILL_PROGRESS = [
  { skill: "Frontend Architecture", percent: 95, color: "bg-emerald-600" },
  { skill: "Backend Microservices", percent: 72, color: "bg-indigo-600" },
  { skill: "Cloud & AWS Deployment", percent: 45, color: "bg-amber-600" },
  { skill: "DevOps & Docker/K8s", percent: 35, color: "bg-purple-600" },
  { skill: "Data Structures & System Design", percent: 60, color: "bg-teal-600" },
];

const DEFAULT_TARGET_COMPANIES = [
  { name: "Stripe", role: "Staff Software Engineer", comp: "$195,000 - $240,000 / yr" },
  { name: "Linear", role: "Frontend Architect", comp: "$180,000 - $220,000 / yr" },
  { name: "Vercel", role: "Senior Developer Advocate", comp: "$175,000 - $215,000 / yr" },
  { name: "Razorpay", role: "Engineering Lead", comp: "₹35L - ₹50L / yr" },
];

export default function CareerWorkspace() {
  const { activeResumeFileName } = useResumeStore();
  const [currentRole, setCurrentRole] = useState("Senior Frontend Engineer");
  const [targetGoal, setTargetGoal] = useState("Staff Software Engineer");
  const [timelineMonths, setTimelineMonths] = useState("6");

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleGenerateRoadmap = async () => {
    setIsProcessing(true);
    setActiveWorkflow("roadmap");
    try {
      const data = await aiService.generateCareerRoadmap(currentRole, targetGoal);
      setResult(data);
      toast.success("Generated Career Growth Roadmap!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to generate career roadmap");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkillGap = async () => {
    setIsProcessing(true);
    setActiveWorkflow("skillgap");
    try {
      const data = await aiService.generateSkillGap(["React", "TypeScript", "Node.js"], targetGoal);
      setResult(data);
      toast.success("Calculated Skill Gap Matrix!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to calculate skill gap");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* 1. HEADER & FORM CARD */}
      <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0 shadow-2xs">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Visual Career Planner & Progression
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Generate milestone execution roadmaps, skill gap matrices, certifications, and target company trajectory.
              </p>
            </div>
          </div>

          {activeResumeFileName && (
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 shrink-0">
              ✓ Active: {activeResumeFileName}
            </div>
          )}
        </div>

        {/* 3-COLUMN EQUAL WIDTH FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          <Select
            label="Current Role"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            className="w-full"
          >
            {COMMON_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>

          <Select
            label="Target Role"
            value={targetGoal}
            onChange={(e) => setTargetGoal(e.target.value)}
            className="w-full"
          >
            {COMMON_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>

          <Select
            label="Roadmap Duration"
            value={timelineMonths}
            onChange={(e) => setTimelineMonths(e.target.value)}
            className="w-full"
          >
            <option value="3">3 Months (Accelerated)</option>
            <option value="6">6 Months (Standard)</option>
            <option value="12">12 Months (1 Year)</option>
            <option value="18">18 Months (1.5 Years)</option>
            <option value="24">24 Months (2 Years)</option>
          </Select>
        </div>

        {/* ACTION BUTTON ROW */}
        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerateRoadmap}
            isLoading={isProcessing && activeWorkflow === "roadmap"}
            leftIcon={<Sparkles size={18} />}
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 w-full sm:w-auto"
          >
            Generate Roadmap
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleSkillGap}
            isLoading={isProcessing && activeWorkflow === "skillgap"}
            leftIcon={<Target size={18} />}
            className="w-full sm:w-auto"
          >
            Analyze Skill Gap
          </Button>
        </div>
      </div>

      {/* 2. GUIDED HELPER EMPTY STATE */}
      {!result && (
        <div className="p-10 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-xs w-full">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
            <TrendingUp size={26} />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            Career Strategy Planner Ready
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
            Choose your current role and target position above to generate a visual milestone execution roadmap and skill gap matrix.
          </p>
        </div>
      )}

      {/* 3. DETAILED DASHBOARD (TIMELINE LEFT, SKILL PROGRESS RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* LEFT COLUMN: MILESTONE EXECUTION TIMELINE */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 w-full">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Calendar size={20} className="text-emerald-600" />
              Milestone Execution Timeline ({timelineMonths} Months)
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {currentRole} → {targetGoal}
            </span>
          </div>

          <div className="relative pl-8 space-y-7 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {result?.roadmap ? (
              (result.roadmap || []).map((step: any, idx: number) => (
                <div key={idx} className="relative space-y-1.5">
                  <div className="absolute -left-8 top-0.5 h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs ring-4 ring-white dark:ring-slate-900">
                    {idx + 1}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      {step.phase || `Month ${idx + 1}`}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
                      {step.duration || "4 Weeks"}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                    {step.title || step.phase}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {step.description || step.details}
                  </p>
                </div>
              ))
            ) : (
              // DEFAULT ROADMAP TIMELINE
              [
                { month: "Month 1", title: "Advanced Frontend Architecture", desc: "Master React Virtual DOM reconciliation, micro-frontends, custom hooks state orchestration, and Web Vitals." },
                { month: "Month 2", title: "Backend Microservices & Node.js", desc: "Design REST & GraphQL APIs, Redis distributed caching, RabbitMQ event queues, and PostgreSQL indexing." },
                { month: "Month 3", title: "Docker Containerization & Kubernetes", desc: "Containerize applications, build multi-stage Dockerfiles, and configure Kubernetes deployment manifests." },
                { month: "Month 4", title: "AWS Cloud Infrastructure & Serverless", desc: "Provision AWS ECS clusters, CloudFront CDN edge caching, DynamoDB tables, and IAM security policies." },
                { month: "Month 5", title: "High-Availability System Design", desc: "Architect rate limiters, load balancers, database sharding, and fault-tolerant multi-region failover." },
                { month: "Month 6", title: "Executive Interview Prep & Offer Negotiation", desc: "Mock Staff Engineer system design interviews, STAR leadership storytelling, and compensation negotiation." },
              ].map((step, idx) => (
                <div key={idx} className="relative space-y-1.5">
                  <div className="absolute -left-8 top-0.5 h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs ring-4 ring-white dark:ring-slate-900">
                    {idx + 1}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      {step.month}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
                      4 Weeks
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SKILL PROGRESS MATRIX & TARGET COMPANIES */}
        <div className="lg:col-span-5 space-y-8 w-full">
          {/* SKILL MASTERY PROGRESS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 w-full">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Award size={20} className="text-emerald-600" />
              Skill Progress Matrix
            </h3>

            <div className="space-y-4">
              {DEFAULT_SKILL_PROGRESS.map((item) => (
                <div key={item.skill} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{item.skill}</span>
                    <span className="text-emerald-600 font-black">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TARGET COMPANIES & SALARY TRAJECTORY */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 w-full">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Building size={20} className="text-emerald-600" />
              Target Companies Benchmark
            </h3>

            <div className="space-y-3.5">
              {DEFAULT_TARGET_COMPANIES.map((comp) => (
                <div key={comp.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">{comp.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{comp.role}</p>
                  </div>
                  <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 shrink-0">
                    {comp.comp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECOMMENDED LEARNING RESOURCES & CERTIFICATIONS */}
      <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 w-full">
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <BookOpen size={20} className="text-emerald-600" />
          Recommended Learning Resources & Certifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wider block">Certification</span>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">AWS Certified Solutions Architect</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Validates cloud infrastructure design, VPC networking, and security.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider block">System Design</span>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">Designing Data-Intensive Apps</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Martin Kleppmann guide on replication, transactions, and consensus.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[11px] font-black text-purple-600 uppercase tracking-wider block">Hands-on Project</span>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">Distributed Rate Limiter Service</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Build a Redis sliding window rate limiter microservice with Docker.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
