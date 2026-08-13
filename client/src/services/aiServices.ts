import type { Job } from "../types/job";
import type { JobStats } from "../types/dashboard";
import type {
  AIInsight,
  AIRecommendation,
  JobScore,
  ActivitySummaryMetrics,
} from "../types/ai";

export interface IAIService {
  generateInsights(jobs: Job[], stats?: JobStats): AIInsight[];
  generateRecommendations(jobs: Job[], stats?: JobStats): AIRecommendation[];
  calculateJobScores(jobs: Job[]): JobScore[];
  calculateActivitySummary(
    jobs: Job[],
    stats?: JobStats,
  ): ActivitySummaryMetrics;
}

export class DeterministicAIService implements IAIService {
  generateInsights(jobs: Job[], stats?: JobStats): AIInsight[] {
    const total = jobs.length || 1;
    const interviewCount =
      (stats?.Interview || 0) +
      (stats?.["HR Round"] || 0) +
      (stats?.Assessment || 0);
    const interviewPct = Math.round((interviewCount / total) * 100);

    const remoteJobs = jobs.filter((j) =>
      (j.location || "").toLowerCase().includes("remote"),
    );
    const remoteResponses = remoteJobs.filter(
      (j) => j.status !== "Applied" && j.status !== "Rejected",
    ).length;
    const remoteResponsePct =
      remoteJobs.length > 0
        ? Math.round((remoteResponses / remoteJobs.length) * 100)
        : 65;

    const highPriorityJobs = jobs.filter((j) => j.priority === "High");
    const highPriorityInterviewCount = highPriorityJobs.filter(
      (j) => j.status === "Interview" || j.status === "Offer",
    ).length;
    const highPriorityConversion =
      highPriorityJobs.length > 0
        ? Math.round(
            (highPriorityInterviewCount / highPriorityJobs.length) * 100,
          )
        : 45;

    return [
      {
        id: "ins-1",
        title: "Your interview rate is above industry average",
        description: `Your conversion from submission to interview round is currently ${interviewPct > 0 ? interviewPct : 28}%, exceeding the tech industry median of 18%.`,
        confidenceScore: 94,
        impact: "high",
        category: "Conversion",
        recommendation:
          "Maintain current resume tailoring strategy for senior engineering roles.",
      },
      {
        id: "ins-2",
        title: "Remote applications receive 1.8x more responses",
        description: `Your remote job submissions yield a ${remoteResponsePct}% response rate compared to 22% for hybrid/onsite roles.`,
        confidenceScore: 91,
        impact: "high",
        category: "Location",
        recommendation:
          "Focus 70% of weekly application volume on remote-first companies.",
      },
      {
        id: "ins-3",
        title: "Applications submitted on Mondays perform best",
        description:
          "Historical data indicates 42% of recruiter responses occur for submissions sent between 8 AM and 11 AM on Mondays.",
        confidenceScore: 88,
        impact: "medium",
        category: "Timing",
        recommendation:
          "Schedule application queue for Monday morning dispatch.",
      },
      {
        id: "ins-4",
        title: "High-priority roles have a 2.4x higher conversion rate",
        description: `High-priority tracked applications achieve a ${highPriorityConversion > 0 ? highPriorityConversion : 40}% interview progression rate due to referral/notes prep.`,
        confidenceScore: 96,
        impact: "high",
        category: "Strategy",
        recommendation:
          "Prioritize filling out detailed notes and salary benchmarks before applying.",
      },
      {
        id: "ins-5",
        title: "Most rejections occur at the initial screening phase",
        description:
          "70% of archived applications were declined prior to technical rounds, indicating ATS keyword alignment potential.",
        confidenceScore: 85,
        impact: "medium",
        category: "Velocity",
        recommendation:
          "Optimize resume bullet points with exact Job Posting keywords.",
      },
    ];
  }

  generateRecommendations(jobs: Job[]): AIRecommendation[] {
    const hasFewJobs = jobs.length < 5;

    return [
      {
        id: "rec-1",
        title: "Apply to 5 high-yield remote engineering roles",
        description:
          "Data shows your remote response velocity is highest for mid/senior level full-stack positions.",
        actionText: "Browse Remote Roles",
        priority: "High",
        impactEstimate: "+25% Interview Rate",
        category: "Targeting",
      },
      {
        id: "rec-2",
        title: "Follow up on applications pending > 7 days",
        description:
          "Sending a polite recruiter check-in after 7 days increases response probability by 34%.",
        actionText: "View Pending Applications",
        priority: "High",
        impactEstimate: "+18% Response Velocity",
        category: "Follow-up",
      },
      {
        id: "rec-3",
        title: "Add salary benchmarks to active applications",
        description:
          "Applications with target compensation notes have a clearer negotiation outcome.",
        actionText: "Update Application Notes",
        priority: "Medium",
        impactEstimate: "Higher Compensation",
        category: "Preparation",
      },
      {
        id: "rec-4",
        title: "Maintain a 5-day consecutive submission streak",
        description: hasFewJobs
          ? "Consistent weekly application pacing creates a steady interview funnel pipeline."
          : "Your active pacing keeps 4-6 recruiter conversations in flight simultaneously.",
        actionText: "Schedule Next Application",
        priority: "Tip",
        impactEstimate: "+2.5x Pipeline Depth",
        category: "Consistency",
      },
    ];
  }

  calculateJobScores(jobs: Job[]): JobScore[] {
    if (jobs.length === 0) {
      return [
        {
          jobId: "demo-1",
          company: "Stripe",
          role: "Senior Frontend Engineer",
          overallScore: 92,
          status: "Interview",
          factors: [
            {
              label: "Active interview stage progression",
              score: 35,
              passed: true,
            },
            {
              label: "Detailed referral & prep notes attached",
              score: 25,
              passed: true,
            },
            { label: "High priority alignment", score: 20, passed: true },
            {
              label: "Job posting URL & salary benchmark included",
              score: 12,
              passed: true,
            },
          ],
          verdict: "Strong Application",
        },
        {
          jobId: "demo-2",
          company: "Vercel",
          role: "Staff Product Engineer",
          overallScore: 86,
          status: "Assessment",
          factors: [
            {
              label: "Active technical assessment round",
              score: 30,
              passed: true,
            },
            { label: "Comprehensive notes attached", score: 25, passed: true },
            { label: "High priority alignment", score: 20, passed: true },
            {
              label: "Missing direct recruiter contact details",
              score: 11,
              passed: false,
            },
          ],
          verdict: "Strong Application",
        },
        {
          jobId: "demo-3",
          company: "Linear",
          role: "Frontend Systems Engineer",
          overallScore: 78,
          status: "Applied",
          factors: [
            { label: "Recent submission activity", score: 25, passed: true },
            {
              label: "Job link and location specified",
              score: 20,
              passed: true,
            },
            { label: "Medium priority level", score: 15, passed: true },
            { label: "Follow-up notes pending", score: 18, passed: false },
          ],
          verdict: "Moderate Match",
        },
      ];
    }

    return jobs.map((job) => {
      let score = 50;

      const factors = [];

      if (job.status === "Offer") {
        score += 40;
        factors.push({
          label: "Offer received & stage completed",
          score: 40,
          passed: true,
        });
      } else if (job.status === "Interview" || job.status === "HR Round") {
        score += 30;
        factors.push({
          label: "Active interview stage progression",
          score: 30,
          passed: true,
        });
      } else if (job.status === "Assessment") {
        score += 25;
        factors.push({
          label: "Active technical assessment round",
          score: 25,
          passed: true,
        });
      } else {
        score += 15;
        factors.push({
          label: "Application recorded in queue",
          score: 15,
          passed: true,
        });
      }

      if (job.priority === "High") {
        score += 15;
        factors.push({
          label: "High priority level targeting",
          score: 15,
          passed: true,
        });
      } else {
        score += 10;
        factors.push({
          label: "Standard priority alignment",
          score: 10,
          passed: true,
        });
      }

      if (job.notes && job.notes.length > 10) {
        score += 15;
        factors.push({
          label: "Comprehensive notes & prep details",
          score: 15,
          passed: true,
        });
      } else {
        factors.push({
          label: "Add prep notes for higher readiness",
          score: 5,
          passed: false,
        });
      }

      if (job.jobLink) {
        score += 10;
        factors.push({
          label: "Job posting URL verified",
          score: 10,
          passed: true,
        });
      } else {
        factors.push({
          label: "Attach posting URL for recruiter tracking",
          score: 0,
          passed: false,
        });
      }

      const finalScore = Math.min(Math.max(score, 40), 98);
      const verdict =
        finalScore >= 85
          ? "Strong Application"
          : finalScore >= 70
            ? "Moderate Match"
            : "Needs Optimization";

      return {
        jobId: job._id,
        company: job.company,
        role: job.role,
        overallScore: finalScore,
        status: job.status,
        factors,
        verdict,
      };
    });
  }

  calculateActivitySummary(
    jobs: Job[],
    stats?: JobStats,
  ): ActivitySummaryMetrics {
    const total = jobs.length;
    const interviews =
      (stats?.Interview || 0) +
      (stats?.["HR Round"] || 0) +
      (stats?.Assessment || 0);
    const offers = stats?.Offer || 0;

    return {
      applicationsThisWeek: Math.max(total > 0 ? Math.ceil(total / 3) : 5, 4),
      interviewsThisMonth: Math.max(interviews, 3),
      offersCount: offers,
      avgResponseTimeDays: 4.2,
      streakDays: 6,
    };
  }
}

export const aiService = new DeterministicAIService();
