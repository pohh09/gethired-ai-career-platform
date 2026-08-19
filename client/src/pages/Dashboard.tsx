import { useNavigate } from "react-router-dom";
import { Briefcase, CalendarCheck, Award, XCircle } from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import KpiCard from "../components/dashboard/KpiCard";
import ActionCenter from "../components/dashboard/ActionCenter";
import ApplicationStatus from "../components/dashboard/ApplicationStatus";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import RecentApplications from "../components/dashboard/RecentApplications";
import InterviewTimeline from "../components/dashboard/InterviewTimeline";
import WeeklyGoal from "../components/dashboard/WeeklyGoal";
import QuickActions from "../components/dashboard/QuickActions";
import EmptyDashboard from "../components/dashboard/EmptyDashboard";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import { useDashboard } from "../hooks/useDashboard";
import { useJobs } from "../hooks/useJobs";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: statsData, isLoading: isStatsLoading } = useDashboard();
  const { data: recentJobsData, isLoading: isJobsLoading } = useJobs({
    page: 1,
    limit: 5,
    sortBy: "newest",
  });

  const stats = statsData?.stats;
  const totalJobs = statsData?.totalJobs || 0;
  const recentJobs = recentJobsData?.data || [];

  const activeInterviewsCount = stats?.Interview ?? 2;
  const offersCount = stats?.Offer ?? 1;
  const rejectionsCount = stats?.Rejected ?? 2;

  const isLoadingInitial = isStatsLoading && isJobsLoading;

  if (isLoadingInitial) {
    return <DashboardSkeleton />;
  }

  if (totalJobs === 0 && !isStatsLoading) {
    return <EmptyDashboard onAddFirstApplication={() => navigate("/jobs")} />;
  }

  return (
    <div className="space-y-8 pb-12">
      <DashboardHeader onAddJobClick={() => navigate("/jobs")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Total Applications"
          value={totalJobs || 13}
          icon={<Briefcase size={20} />}
          comparisonText="vs last month"
          percentageChange="+14%"
          trendDirection="up"
          accentColor="blue"
          isLoading={isStatsLoading}
          miniGraphData={[4, 6, 5, 8, 7, 10, 12, 14]}
        />
        <KpiCard
          title="Active Interviews"
          value={activeInterviewsCount}
          icon={<CalendarCheck size={20} />}
          comparisonText="active rounds"
          percentageChange="+25%"
          trendDirection="up"
          accentColor="amber"
          isLoading={isStatsLoading}
          miniGraphData={[1, 2, 1, 3, 2, 4, 3, 5]}
        />
        <KpiCard
          title="Offers"
          value={offersCount}
          icon={<Award size={20} />}
          comparisonText="received"
          percentageChange="+100%"
          trendDirection="up"
          accentColor="emerald"
          isLoading={isStatsLoading}
          miniGraphData={[0, 0, 1, 0, 1, 1, 2, 2]}
        />
        <KpiCard
          title="Rejected"
          value={rejectionsCount}
          icon={<XCircle size={20} />}
          comparisonText="archived"
          percentageChange="-5%"
          trendDirection="down"
          accentColor="rose"
          isLoading={isStatsLoading}
          miniGraphData={[2, 1, 2, 1, 0, 1, 1, 0]}
        />
      </div>

      <ActionCenter
        onNavigateToJobs={() => navigate("/jobs")}
        onNavigateToCalendar={() => navigate("/calendar")}
      />

      <ApplicationStatus stats={stats} totalApplications={totalJobs || 13} />

      <PerformanceChart
        monthlyData={statsData?.monthlyApplications}
        isLoading={isStatsLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentApplications
          jobs={recentJobs}
          isLoading={isJobsLoading}
          onViewAllClick={() => navigate("/jobs")}
          className="lg:col-span-2"
        />

        <InterviewTimeline />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeeklyGoal
          currentCount={12}
          targetCount={20}
          className="lg:col-span-1"
        />

        <div className="lg:col-span-2 space-y-6">
          <QuickActions
            onAddApplication={() => navigate("/jobs")}
            onScheduleInterview={() => navigate("/calendar")}
            onOpenAnalytics={() => navigate("/analytics")}
            onManageCompanies={() => navigate("/companies")}
            onUpdateProfile={() => navigate("/profile")}
          />
        </div>
      </div>
    </div>
  );
}
