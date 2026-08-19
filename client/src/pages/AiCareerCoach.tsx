import { useState, useEffect } from "react";
import { Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import Skeleton from "../components/ui/Skeleton";
import CareerHealthCard from "../components/careerCoach/CareerHealthCard";
import WeeklyReport from "../components/careerCoach/WeeklyReport";
import RecommendationCard from "../components/careerCoach/RecommendationCard";
import SkillGapCard from "../components/careerCoach/SkillGapCard";
import LearningRoadmap from "../components/careerCoach/LearningRoadmap";
import CareerInsights from "../components/careerCoach/CareerInsights";
import GoalTracker from "../components/careerCoach/GoalTracker";
import { fetchCareerCoachAnalysis } from "../services/careerCoachService";
import type { CareerCoachResult } from "../types/careerCoach";

export default function AiCareerCoach() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [result, setResult] = useState<CareerCoachResult | null>(null);

  useEffect(() => {
    loadCoachData();
  }, []);

  const loadCoachData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCareerCoachAnalysis();
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast.error("Failed to load AI career coach metrics.");
      }
    } catch (_err) {
      toast.error("Error connecting to AI career coach service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Popup blocked! Please enable popups to export PDF.");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>GetHired AI — Weekly Executive Career Report</title>
            <style>
              @page { size: A4; margin: 15mm; }
              body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #0f172a;
                line-height: 1.5;
                font-size: 10pt;
                padding: 20px;
                margin: 0;
                background: #ffffff;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 3px solid #6366f1;
                padding-bottom: 12px;
                margin-bottom: 20px;
              }
              .brand { font-size: 20pt; font-weight: bold; color: #4338ca; margin: 0; }
              .subbrand { font-size: 9pt; color: #64748b; margin: 2px 0 0 0; }
              .health-badge {
                text-align: right;
                background: #e0e7ff;
                color: #3730a3;
                padding: 8px 16px;
                border-radius: 12px;
                font-weight: bold;
              }
              .health-score { font-size: 16pt; font-weight: 800; }
              h2 { font-size: 12pt; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 8px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
              .grid-metrics {
                display: grid;
                grid-template-cols: repeat(5, 1fr);
                gap: 10px;
                margin-bottom: 16px;
              }
              .metric-box {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                padding: 10px;
                border-radius: 8px;
                text-align: center;
              }
              .metric-val { font-size: 16pt; font-weight: bold; color: #0f172a; }
              .metric-lbl { font-size: 7.5pt; text-transform: uppercase; color: #64748b; font-weight: bold; }
              ul { padding-left: 18px; margin: 6px 0; }
              li { margin-bottom: 4px; }
              .skill-tag { display: inline-block; padding: 2px 8px; background: #f1f5f9; border-radius: 6px; font-size: 8.5pt; font-weight: bold; margin: 2px; }
              .roadmap-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
              .roadmap-table th, .roadmap-table td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; font-size: 9pt; }
              .roadmap-table th { background: #f8fafc; color: #475569; }
              .footer { margin-top: 30px; text-align: center; font-size: 8pt; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1 class="brand">GetHired AI</h1>
                <p class="subbrand">Executive Career Guidance & Pipeline Report</p>
              </div>
              <div class="health-badge">
                <div class="health-score">${result.healthScore.overall} / 100</div>
                <div style="font-size: 7.5pt; text-transform: uppercase;">Career Health Score</div>
              </div>
            </div>

            <h2>1. Weekly Pipeline Metrics</h2>
            <div class="grid-metrics">
              <div class="metric-box">
                <div class="metric-val">${result.weeklyMetrics.applicationsThisWeek}</div>
                <div class="metric-lbl">Applications</div>
              </div>
              <div class="metric-box">
                <div class="metric-val">${result.weeklyMetrics.interviewsAttended}</div>
                <div class="metric-lbl">Interviews</div>
              </div>
              <div class="metric-box">
                <div class="metric-val">${result.weeklyMetrics.offersReceived}</div>
                <div class="metric-lbl">Offers</div>
              </div>
              <div class="metric-box">
                <div class="metric-val">${result.weeklyMetrics.rejectionsCount}</div>
                <div class="metric-lbl">Rejections</div>
              </div>
              <div class="metric-box">
                <div class="metric-val">${result.weeklyMetrics.followUpsPending}</div>
                <div class="metric-lbl">Follow-ups</div>
              </div>
            </div>

            <h2>2. Executive AI Recommendations</h2>
            <ul>
              ${result.recommendations
                .map(
                  (r) =>
                    `<li><strong>[${r.priority} Priority - ${r.category}] ${r.title}:</strong> ${r.description}</li>`,
                )
                .join("")}
            </ul>

            <h2>3. Skill Gap Analysis & Market Demand</h2>
            <p><strong>Verified Candidate Skills:</strong> ${result.skillGap.currentSkills.map((s) => `<span class="skill-tag">${s}</span>`).join(" ")}</p>
            <p><strong>Target Missing Skills:</strong> ${result.skillGap.missingSkills.map((s) => `<span class="skill-tag" style="background:#ffe4e6;color:#9f1239;">${s}</span>`).join(" ")}</p>
            <p><strong>Learning Priorities:</strong> ${result.skillGap.learningPriority.join(" → ")}</p>

            <h2>4. 4-Week Learning Roadmap</h2>
            <table class="roadmap-table">
              <thead>
                <tr>
                  <th style="width: 15%;">Week</th>
                  <th style="width: 30%;">Topic</th>
                  <th>Key Description & Focus</th>
                </tr>
              </thead>
              <tbody>
                ${result.roadmap
                  .map(
                    (m) =>
                      `<tr><td><strong>${m.week}</strong></td><td>${m.topic}</td><td>${m.description}</td></tr>`,
                  )
                  .join("")}
              </tbody>
            </table>

            <h2>5. Application Velocity & Conversion</h2>
            <p>
              Target Role: <strong>${result.insights.bestRole}</strong> | 
              Optimal Day: <strong>${result.insights.bestDay}</strong> | 
              Avg Response: <strong>${result.insights.avgResponseDays} Days</strong> | 
              Interview Conversion: <strong>${result.insights.interviewConversionPct}%</strong>
            </p>

            <div class="footer">
              Generated via GetHired AI Career Coach • ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>

            <script>
              window.onload = function() {
                setTimeout(function() { window.print(); }, 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("PDF print dialog opened!");
    } catch (_err) {
      toast.error("Failed to generate PDF report.");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="AI Career Coach"
          subtitle="Personalized career guidance, health scores, skill gap analysis, and 4-week learning roadmaps based on your active job search."
        />

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCoachData}
            isLoading={isLoading}
            leftIcon={<RefreshCw size={14} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={!result || isLoading}
            leftIcon={<Download size={14} />}
            className="font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xs"
          >
            Download PDF Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <Loader size="lg" className="mx-auto" />
            <Skeleton height={20} width="60%" className="mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
              >
                <Skeleton height={14} width="80%" />
                <Skeleton height={24} width="50%" />
              </div>
            ))}
          </div>
        </div>
      ) : result ? (
        <div className="space-y-8">
          <CareerHealthCard metrics={result.healthScore} />

          <WeeklyReport metrics={result.weeklyMetrics} />

          <RecommendationCard recommendations={result.recommendations} />

          <SkillGapCard skillGap={result.skillGap} />

          <LearningRoadmap roadmap={result.roadmap} />

          <CareerInsights insights={result.insights} />

          <GoalTracker initialGoals={result.goals} />
        </div>
      ) : null}
    </div>
  );
}
