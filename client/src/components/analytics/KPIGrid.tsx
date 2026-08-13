import {
  Briefcase,
  MessageSquare,
  CalendarCheck,
  Award,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
} from "lucide-react";
import AnalyticsCard from "./AnalyticsCard";

export interface KPIMetrics {
  totalApplications: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  rejectionRate: number;
  avgResponseTimeDays: number;
  activeApplications: number;
  successRate: number;
}

export interface KPIGridProps {
  metrics: KPIMetrics;
  isLoading?: boolean;
  className?: string;
}

export default function KPIGrid({
  metrics,
  isLoading = false,
  className = "",
}: KPIGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${className}`}>
      <AnalyticsCard
        title="Total Applications"
        value={metrics.totalApplications}
        icon={<Briefcase size={20} />}
        percentage="+18%"
        trendDirection="up"
        accentColor="indigo"
        tooltipText="Total job submissions recorded in pipeline"
        isLoading={isLoading}
      />


      <AnalyticsCard
        title="Response Rate"
        value={`${metrics.responseRate.toFixed(1)}%`}
        icon={<MessageSquare size={20} />}
        percentage="+5.2%"
        trendDirection="up"
        accentColor="blue"
        tooltipText="Percentage of applications receiving employer response"
        isLoading={isLoading}
      />

      <AnalyticsCard
        title="Interview Rate"
        value={`${metrics.interviewRate.toFixed(1)}%`}
        icon={<CalendarCheck size={20} />}
        percentage="+12.4%"
        trendDirection="up"
        accentColor="amber"
        tooltipText="Conversion rate from submission to interview round"
        isLoading={isLoading}
      />

      <AnalyticsCard
        title="Offer Rate"
        value={`${metrics.offerRate.toFixed(1)}%`}
        icon={<Award size={20} />}
        percentage="+4.0%"
        trendDirection="up"
        accentColor="emerald"
        tooltipText="Percentage of total applications resulting in formal job offers"
        isLoading={isLoading}
      />

      <AnalyticsCard
        title="Rejection Rate"
        value={`${metrics.rejectionRate.toFixed(1)}%`}
        icon={<XCircle size={20} />}
        percentage="-3.1%"
        trendDirection="down"
        accentColor="rose"
        tooltipText="Percentage of archived or declined applications"
        isLoading={isLoading}
      />

      <AnalyticsCard
        title="Avg Response Time"
        value={`${metrics.avgResponseTimeDays}d`}
        icon={<Clock size={20} />}
        percentage="-1.5d"
        trendDirection="up"
        accentColor="purple"
        tooltipText="Average days elapsed from application to initial response"
        isLoading={isLoading}
      />

      <AnalyticsCard
        title="Active Applications"
        value={metrics.activeApplications}
        icon={<Zap size={20} />}
        percentage="+6"
        trendDirection="up"
        accentColor="cyan"
        tooltipText="Applications currently in Applied, Screening, or Interview status"
        isLoading={isLoading}
      />

      <AnalyticsCard
        title="Success Rate"
        value={`${metrics.successRate.toFixed(1)}%`}
        icon={<TrendingUp size={20} />}
        percentage="+8.5%"
        trendDirection="up"
        accentColor="violet"
        tooltipText="Combined interview & offer progression velocity"
        isLoading={isLoading}
      />
    </div>
  );
}
