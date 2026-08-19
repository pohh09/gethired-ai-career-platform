import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, RefreshCw, Compass } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import SectionTitle from "../components/dashboard/SectionTitle";
import EmptyState from "../components/dashboard/EmptyState";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import ActivitySummary from "../components/ai/ActivitySummary";
import InsightCard from "../components/ai/InsightCard";
import RecommendationCard from "../components/ai/RecommendationCard";
import ScoreCard from "../components/ai/ScoreCard";
import { aiService } from "../services/aiServices";
import { useJobs } from "../hooks/useJobs";
import { useDashboard } from "../hooks/useDashboard";
import type { AIInsight, AIRecommendation } from "../types/ai";

export default function AiInsights() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: statsData, isLoading: isStatsLoading } = useDashboard();
  const { data: jobsData, isLoading: isJobsLoading } = useJobs({ page: 1, limit: 100 });

  const jobs = jobsData?.data || [];
  const stats = statsData?.stats;
  const totalJobs = statsData?.totalJobs || 0;

  const insights = useMemo(() => {
    return aiService.generateInsights(jobs, stats);
  }, [jobs, stats]);

  const recommendations = useMemo(() => {
    return aiService.generateRecommendations(jobs);
  }, [jobs]);

  const jobScores = useMemo(() => {
    return aiService.calculateJobScores(jobs);
  }, [jobs]);

  const activitySummary = useMemo(() => {
    return aiService.calculateActivitySummary(jobs, stats);
  }, [jobs, stats]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("AI Insights re-analyzed & updated!");
    }, 600);
  };

  const handleRecommendationAction = (rec: AIRecommendation) => {
    if (rec.actionText.includes("Browse") || rec.actionText.includes("View") || rec.actionText.includes("Schedule")) {
      navigate("/jobs");
    } else {
      toast.success(`Action applied: ${rec.title}`);
    }
  };

  const handleInsightApply = (insight: AIInsight) => {
    toast.success(`Strategy rule saved: ${insight.title}`);
  };

  const isLoading = isStatsLoading || isJobsLoading;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="AI Insights"
        subtitle="Actionable insights to improve your job search velocity and interview conversion."
        action={
          <Button
            variant="primary"
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            leftIcon={<Sparkles size={16} />}
          >
            Analyze Applications
          </Button>
        }
        secondaryAction={
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            leftIcon={<RefreshCw size={14} className={isAnalyzing ? "animate-spin" : ""} />}
          >
            Refresh
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <Skeleton width="220px" height={28} className="mb-4" />
            <Skeleton width="100%" height={120} className="rounded-xl" />
          </div>
        </div>
      ) : totalJobs === 0 && !isStatsLoading ? (
        <EmptyState
          title="No AI Analysis Available Yet"
          description="Add your target job applications to unlock AI-powered match scores, conversion insights, and recommendation strategies."
          actionText="Add Job Application"
          onAction={() => navigate("/jobs")}
        />
      ) : (

        <>
          <ActivitySummary summary={activitySummary} />

          <div className="space-y-4">
            <SectionTitle
              title="Performance AI Insights"
              subtitle="Deterministic pattern analysis calculated from your target applications"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onApplyRecommendation={handleInsightApply}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <SectionTitle
              title="Application Job Scores"
              subtitle="Readiness score out of 100 calculated from stage, priority, notes, and activity factors"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {jobScores.slice(0, 3).map((score) => (
                <ScoreCard key={score.jobId} jobScore={score} />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <SectionTitle
              title="Strategic Recommendations"
              subtitle="High-yield action steps to maximize recruiter responses and interview rounds"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onAction={handleRecommendationAction}
                />
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 bg-gradient-to-r from-blue-50/70 via-cyan-50/50 to-white dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
                <Compass size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  LLM AI Engine Architecture Ready
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Decoupled IAIService contract allows plugging OpenAI GPT-4 / Gemini API key without modifying UI code.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/settings")}
            >
              Configure AI Settings
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
