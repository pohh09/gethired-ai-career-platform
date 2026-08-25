import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  LogIn,
  Activity,
  Briefcase,
  FileText,
  Sparkles,
  MessageSquare,
  TrendingUp,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Clock,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import toast from "react-hot-toast";
import adminAnalyticsService from "../services/adminAnalyticsService";
import type {
  OverviewMetrics,
  UserAnalyticsResponse,
  LoginAnalyticsResponse,
  FeatureRankingItem,
  AIAnalyticsResponse,
  JobAnalyticsResponse,
  ResumeAnalyticsResponse,
  FeedbackAnalyticsResponse,
  UserDetailResponse,
  AdminUserListItem,
} from "../types/adminAnalytics";

const CHART_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#6366F1",
  "#64748B",
];

const TABS = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "users", label: "Users & Registrations", icon: Users },
  { id: "logins", label: "Login Activity", icon: LogIn },
  { id: "features", label: "Features & AI", icon: Sparkles },
  { id: "jobs", label: "Jobs & Resumes", icon: Briefcase },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
];

const DATE_RANGES = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "12m", label: "12 Months" },
];

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30d");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Data states
  const [overview, setOverview] = useState<OverviewMetrics | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalyticsResponse | null>(null);
  const [loginAnalytics, setLoginAnalytics] = useState<LoginAnalyticsResponse | null>(null);
  const [features, setFeatures] = useState<FeatureRankingItem[]>([]);
  const [aiAnalytics, setAiAnalytics] = useState<AIAnalyticsResponse | null>(null);
  const [jobAnalytics, setJobAnalytics] = useState<JobAnalyticsResponse | null>(null);
  const [resumeAnalytics, setResumeAnalytics] = useState<ResumeAnalyticsResponse | null>(null);
  const [feedbackAnalytics, setFeedbackAnalytics] = useState<FeedbackAnalyticsResponse | null>(null);

  // User table controls
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userSortBy, setUserSortBy] = useState("createdAt");
  const [userSortOrder, setUserSortOrder] = useState("desc");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // User Detail modal state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetailResponse | null>(null);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Master fetch function
  const fetchAllAnalytics = useCallback(async (showToast = false) => {
    try {
      setRefreshing(true);
      setError(null);

      const [
        ovRes,
        userRes,
        loginRes,
        featRes,
        aiRes,
        jobRes,
        resumeRes,
        feedRes,
      ] = await Promise.allSettled([
        adminAnalyticsService.getOverview(),
        adminAnalyticsService.getUserAnalytics({
          range: dateRange,
          page: userPage,
          limit: 10,
          search: userSearch,
          sortBy: userSortBy,
          sortOrder: userSortOrder,
          filterRole: userRoleFilter,
        }),
        adminAnalyticsService.getLoginAnalytics({ range: dateRange }),
        adminAnalyticsService.getFeatureAnalytics(),
        adminAnalyticsService.getAIAnalytics(),
        adminAnalyticsService.getJobAnalytics(),
        adminAnalyticsService.getResumeAnalytics(),
        adminAnalyticsService.getFeedbackAnalytics(),
      ]);

      if (ovRes.status === "fulfilled") setOverview(ovRes.value);
      if (userRes.status === "fulfilled") setUserAnalytics(userRes.value);
      if (loginRes.status === "fulfilled") setLoginAnalytics(loginRes.value);
      if (featRes.status === "fulfilled") setFeatures(featRes.value.rankings);
      if (aiRes.status === "fulfilled") setAiAnalytics(aiRes.value);
      if (jobRes.status === "fulfilled") setJobAnalytics(jobRes.value);
      if (resumeRes.status === "fulfilled") setResumeAnalytics(resumeRes.value);
      if (feedRes.status === "fulfilled") setFeedbackAnalytics(feedRes.value);

      setLastUpdated(new Date());

      if (showToast) {
        toast.success("Analytics refreshed successfully");
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to load admin analytics.");
      toast.error("Failed to refresh analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange, userPage, userSearch, userSortBy, userSortOrder, userRoleFilter]);

  // Fetch on mount or filter changes
  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  // Auto refresh timer
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAllAnalytics(false);
    }, 45000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAllAnalytics]);

  // Load individual user detail
  const handleOpenUserDetail = async (id: string) => {
    try {
      setSelectedUserId(id);
      setLoadingUserDetail(true);
      const data = await adminAnalyticsService.getUserDetail(id);
      setUserDetail(data);
    } catch {
      toast.error("Failed to load user details.");
    } finally {
      setLoadingUserDetail(false);
    }
  };

  // Format relative time helper
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  // Primary KPI items array
  const kpiItems = useMemo(() => {
    if (!overview) return [];
    return [
      {
        title: "Total Users",
        value: overview.users.total.toLocaleString(),
        subtitle: `+${overview.users.newToday} today • +${overview.users.newThisWeek} this week`,
        icon: Users,
        color: "from-blue-600 to-cyan-500",
        textColor: "text-blue-600 dark:text-cyan-400",
      },
      {
        title: "Total Logins",
        value: overview.logins.total.toLocaleString(),
        subtitle: `${overview.logins.uniqueUsers} unique users • ${overview.logins.today} today`,
        icon: LogIn,
        color: "from-violet-600 to-purple-500",
        textColor: "text-violet-600 dark:text-purple-400",
      },
      {
        title: "Active Users (DAU/WAU/MAU)",
        value: `${overview.activeUsers.dau} / ${overview.activeUsers.wau} / ${overview.activeUsers.mau}`,
        subtitle: "Daily / Weekly / Monthly active",
        icon: Activity,
        color: "from-emerald-600 to-teal-500",
        textColor: "text-emerald-600 dark:text-emerald-400",
      },
      {
        title: "Job Applications",
        value: overview.applications.total.toLocaleString(),
        subtitle: `${overview.applications.saved} saved jobs`,
        icon: Briefcase,
        color: "from-amber-600 to-orange-500",
        textColor: "text-amber-600 dark:text-amber-400",
      },
      {
        title: "Resume Uploads",
        value: overview.resumes.totalUploads.toLocaleString(),
        subtitle: "Total document parses",
        icon: FileText,
        color: "from-sky-600 to-blue-500",
        textColor: "text-sky-600 dark:text-sky-400",
      },
      {
        title: "AI Feature Uses",
        value: overview.ai.totalFeatureUses.toLocaleString(),
        subtitle: "ATS, Cover letter, Coach & Mocks",
        icon: Sparkles,
        color: "from-fuchsia-600 to-pink-500",
        textColor: "text-fuchsia-600 dark:text-fuchsia-400",
      },
      {
        title: "Feedback Received",
        value: overview.feedback.totalSubmissions.toLocaleString(),
        subtitle: "User feedback & bug reports",
        icon: MessageSquare,
        color: "from-indigo-600 to-blue-600",
        textColor: "text-indigo-600 dark:text-indigo-400",
      },
      {
        title: "New Users This Month",
        value: `+${overview.users.newThisMonth}`,
        subtitle: "Last 30 days registration",
        icon: TrendingUp,
        color: "from-teal-600 to-cyan-500",
        textColor: "text-teal-600 dark:text-teal-400",
      },
    ];
  }, [overview]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl shadow-xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-cyan-500/30">
              <ShieldCheck size={12} /> System Admin
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Database Stream
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            GetHired Admin Analytics
          </h1>
          <p className="text-xs text-slate-400 max-w-xl font-medium">
            Real-time platform KPIs, user growth trends, authentication metrics, AI utilization, and application telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
            <Clock size={13} className="text-slate-400" />
            <span>Updated {formatTime(lastUpdated)}</span>
          </div>

          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              autoRefresh
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-xs"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
            }`}
          >
            Auto-refresh {autoRefresh ? "ON (45s)" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => fetchAllAnalytics(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200/60 dark:border-slate-800"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-3">
          <AlertCircle size={32} className="mx-auto text-rose-500" />
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
          <button
            onClick={() => fetchAllAnalytics(true)}
            className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {kpiItems.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-4.5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {kpi.title}
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {kpi.value}
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 truncate font-medium">
                    {kpi.subtitle}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
        <div className="flex gap-1 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Areas */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* User Registrations Trend & Application Statuses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Registration Area Chart (2 Cols) */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      User Registration Growth
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      New registered accounts over selected period ({dateRange})
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {DATE_RANGES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setDateRange(r.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          dateRange === r.id
                            ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-64 sm:h-72 w-full pt-2">
                  {userAnalytics?.trend && userAnalytics.trend.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userAnalytics.trend}>
                        <defs>
                          <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                        <XAxis
                          dataKey="date"
                          stroke="#64748B"
                          fontSize={10}
                          tickLine={false}
                        />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0F172A",
                            borderRadius: "12px",
                            border: "1px solid #1E293B",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          name="New Users"
                          stroke="#2563EB"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#userGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                      <Users size={32} className="opacity-30 mb-2" />
                      <p className="text-xs font-bold">No registration trend data for this period</p>
                      <span className="text-[11px]">Real data will plot here automatically</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Statuses Pie Chart (1 Col) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Application Statuses
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live tracker pipeline distribution
                  </p>
                </div>

                <div className="h-56 w-full flex items-center justify-center">
                  {jobAnalytics?.statusDistribution && jobAnalytics.statusDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={jobAnalytics.statusDistribution}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={75}
                          paddingAngle={4}
                        >
                          {jobAnalytics.statusDistribution.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0F172A",
                            borderRadius: "10px",
                            border: "1px solid #1E293B",
                            color: "#fff",
                            fontSize: "11px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-slate-400">
                      <Briefcase size={28} className="opacity-30 mx-auto mb-1.5" />
                      <p className="text-xs font-bold">No applications tracked yet</p>
                    </div>
                  )}
                </div>

                {/* Status Legend Pills */}
                {jobAnalytics?.statusDistribution && jobAnalytics.statusDistribution.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {jobAnalytics.statusDistribution.map((item, idx) => (
                      <div
                        key={item.status}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                        />
                        <span>
                          {item.status}: <strong>{item.count}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Feature Usage & Quick Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feature Usage Ranking Bar Chart */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Top Features Used
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Feature usage count vs unique users
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("features")}
                    className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    View All <ArrowUpRight size={13} />
                  </button>
                </div>

                <div className="h-64 w-full">
                  {features && features.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={features.slice(0, 6)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                        <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={120}
                          stroke="#64748B"
                          fontSize={10}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0F172A",
                            borderRadius: "10px",
                            border: "1px solid #1E293B",
                            color: "#fff",
                            fontSize: "11px",
                          }}
                        />
                        <Bar
                          dataKey="usageCount"
                          name="Usage Count"
                          fill="#2563EB"
                          radius={[0, 6, 6, 0]}
                        />
                        <Bar
                          dataKey="uniqueUsers"
                          name="Unique Users"
                          fill="#06B6D4"
                          radius={[0, 6, 6, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                      <Sparkles size={28} className="opacity-30 mb-1.5" />
                      <p className="text-xs font-bold">No feature activity recorded yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Login vs Unique User Trend */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      Daily Login Activity
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total logins compared to distinct authenticated users
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("logins")}
                    className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    Details <ArrowUpRight size={13} />
                  </button>
                </div>

                <div className="h-64 w-full">
                  {loginAnalytics?.dailyTrend && loginAnalytics.dailyTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={loginAnalytics.dailyTrend}>
                        <defs>
                          <linearGradient id="loginGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                        <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0F172A",
                            borderRadius: "10px",
                            border: "1px solid #1E293B",
                            color: "#fff",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="totalLogins"
                          name="Total Logins"
                          stroke="#7C3AED"
                          strokeWidth={2}
                          fill="url(#loginGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="uniqueUsers"
                          name="Unique Users"
                          stroke="#10B981"
                          strokeWidth={2}
                          fill="none"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                      <LogIn size={28} className="opacity-30 mb-1.5" />
                      <p className="text-xs font-bold">No daily login trends recorded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS & REGISTRATIONS */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* User Search, Filters, & Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Registered Users Directory
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total {userAnalytics?.pagination.total || 0} registered accounts
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search name or email..."
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setUserPage(1);
                      }}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-48 sm:w-60"
                    />
                  </div>

                  {/* Role filter */}
                  <select
                    value={userRoleFilter}
                    onChange={(e) => {
                      setUserRoleFilter(e.target.value);
                      setUserPage(1);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Normal Users</option>
                    <option value="admin">Admins</option>
                  </select>

                  {/* Sort Order */}
                  <select
                    value={`${userSortBy}-${userSortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-");
                      setUserSortBy(field);
                      setUserSortOrder(order);
                      setUserPage(1);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    <option value="createdAt-desc">Newest Registered</option>
                    <option value="createdAt-asc">Oldest Registered</option>
                    <option value="loginCount-desc">Most Logins</option>
                    <option value="lastLoginAt-desc">Recent Login</option>
                    <option value="name-asc">Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Registered</th>
                      <th className="px-4 py-3">Last Login</th>
                      <th className="px-4 py-3">Logins</th>
                      <th className="px-4 py-3">Apps Tracked</th>
                      <th className="px-4 py-3">AI Uses</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {userAnalytics?.users && userAnalytics.users.length > 0 ? (
                      userAnalytics.users.map((u: AdminUserListItem) => (
                        <tr
                          key={u.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                {u.name}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                {u.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {u.isAdmin || u.role === "admin" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                <ShieldCheck size={10} /> Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                User
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                            {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                            {u.loginCount}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                            {u.applicationCount}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                            {u.aiUsageCount}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenUserDetail(u.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 font-extrabold text-[11px] hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                            >
                              <Eye size={12} />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-400 font-medium">
                          No users found matching query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {userAnalytics?.pagination && userAnalytics.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Showing Page {userAnalytics.pagination.page} of {userAnalytics.pagination.totalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={userPage <= 1}
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      type="button"
                      disabled={userPage >= userAnalytics.pagination.totalPages}
                      onClick={() => setUserPage((p) => p + 1)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LOGIN ACTIVITY */}
        {activeTab === "logins" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Total Logins Count
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {loginAnalytics?.totalLogins.toLocaleString() || 0}
                </div>
                <span className="text-[11px] text-slate-400">All recorded user sessions</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Unique Users Logged In
                </span>
                <div className="text-2xl font-black text-blue-600 dark:text-cyan-400">
                  {loginAnalytics?.uniqueUsers.toLocaleString() || 0}
                </div>
                <span className="text-[11px] text-slate-400">Distinct active user accounts</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Returning User Rate
                </span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {loginAnalytics?.returningUsersRate || 0}%
                </div>
                <span className="text-[11px] text-slate-400">
                  {loginAnalytics?.returningUsersCount || 0} users logged in &gt;1 time
                </span>
              </div>
            </div>

            {/* Login Trend Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Daily Authentications & Unique Users
              </h3>

              <div className="h-72 w-full">
                {loginAnalytics?.dailyTrend && loginAnalytics.dailyTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={loginAnalytics.dailyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                      <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          borderRadius: "10px",
                          border: "1px solid #1E293B",
                          color: "#fff",
                          fontSize: "11px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar dataKey="totalLogins" name="Total Logins" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="uniqueUsers" name="Unique Users" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                    No login trend data available yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FEATURES & AI */}
        {activeTab === "features" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feature Usage Rankings Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Feature Usage Rankings
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Which GetHired capabilities users actually utilize
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Feature</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Usage Count</th>
                        <th className="px-4 py-3">Unique Users</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {features && features.length > 0 ? (
                        features.map((f) => (
                          <tr key={f.eventType} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                              {f.name}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {f.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-black text-blue-600 dark:text-cyan-400">
                              {f.usageCount}
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">
                              {f.uniqueUsers}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                            No feature telemetry logged yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dedicated AI Utilization Breakdown */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      AI Features Breakdown
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total {aiAnalytics?.totalAIRequests || 0} AI generation requests
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-fuchsia-50 dark:bg-fuchsia-950 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-800">
                    Top: {aiAnalytics?.mostUsedAIFeature || "None"}
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {aiAnalytics?.byFeature && aiAnalytics.byFeature.length > 0 ? (
                    aiAnalytics.byFeature.map((item, idx) => (
                      <div key={item.featureKey} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {item.count} uses ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(item.percentage, 4)}%`,
                              backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-xs font-bold">
                      No AI requests recorded yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: JOBS & RESUMES */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Companies */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Top Target Companies Applied
                </h3>

                <div className="space-y-2">
                  {jobAnalytics?.topCompanies && jobAnalytics.topCompanies.length > 0 ? (
                    jobAnalytics.topCompanies.map((c, idx) => (
                      <div
                        key={c.company}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 text-xs font-black flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {c.company}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {c.count} applications
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-slate-400 text-xs font-bold">
                      No companies tracked yet
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Activity Breakdown */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Resume Telemetry
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-slate-500">Total Uploads</span>
                    <div className="text-xl font-black text-slate-900 dark:text-white">
                      {resumeAnalytics?.totalUploads || 0}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {resumeAnalytics?.uniqueUploaders || 0} distinct users
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-slate-500">ATS Audits</span>
                    <div className="text-xl font-black text-blue-600 dark:text-cyan-400">
                      {resumeAnalytics?.analysisCount || 0}
                    </div>
                    <span className="text-[10px] text-slate-400">Scores computed</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-500">AI Resume Generator Invocations</span>
                  <div className="text-xl font-black text-purple-600 dark:text-purple-400">
                    {resumeAnalytics?.generatorUsage || 0}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Tailored CVs & resumes generated
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FEEDBACK */}
        {activeTab === "feedback" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-1">
                <span className="text-xs font-bold text-slate-500">Total Feedback Submissions</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {feedbackAnalytics?.total || 0}
                </div>
                <span className="text-[11px] text-slate-400">From live users & guests</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-1">
                <span className="text-xs font-bold text-slate-500">Email Delivered to Admin</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {feedbackAnalytics?.deliveredToAdminCount || 0}
                </div>
                <span className="text-[11px] text-slate-400">Direct inbox notifications</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-1">
                <span className="text-xs font-bold text-slate-500">Categories</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {feedbackAnalytics?.byType && feedbackAnalytics.byType.length > 0 ? (
                    feedbackAnalytics.byType.map((t) => (
                      <span
                        key={t.type}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {t.type}: {t.count}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">None yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Feedback Submissions Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Recent Feedback Submissions
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Author</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Message</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {feedbackAnalytics?.recent && feedbackAnalytics.recent.length > 0 ? (
                      feedbackAnalytics.recent.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400 shrink-0">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {item.authorName}
                              </span>
                              <span className="text-[10px] text-slate-500">{item.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-200 max-w-md break-words">
                            {item.message}
                          </td>
                          <td className="px-4 py-3">
                            {item.emailSent ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                                <CheckCircle2 size={12} /> Delivered
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Logged</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                          No feedback submitted yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    {userDetail?.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {userDetail?.user.name || "User Details"}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {userDetail?.user.email}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUserId(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              {loadingUserDetail ? (
                <div className="py-12 text-center text-xs font-bold text-slate-400">
                  Loading user analytics...
                </div>
              ) : userDetail ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Registration Date
                      </span>
                      <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                        {new Date(userDetail.user.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Total Logins
                      </span>
                      <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                        {userDetail.user.loginCount} sessions
                      </div>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-center">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">
                        Applications
                      </span>
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        {userDetail.metrics.totalApplications}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-center">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                        AI Actions
                      </span>
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        {userDetail.metrics.totalAIEvents}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Feedback
                      </span>
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        {userDetail.metrics.totalFeedbackSubmitted}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Timeline */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      Recent Activity Events
                    </span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {userDetail.recentActivity && userDetail.recentActivity.length > 0 ? (
                        userDetail.recentActivity.map((evt, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px]"
                          >
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate mr-2">
                              {evt.summary}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(evt.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 text-center py-4 text-[11px]">
                          No recent activity recorded
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
