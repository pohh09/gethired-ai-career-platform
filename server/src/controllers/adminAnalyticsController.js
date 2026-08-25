import mongoose from "mongoose";
import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";
import Feedback from "../models/Feedback.js";
import AnalyticsEvent from "../models/AnalyticsEvent.js";

// Helper: Calculate start of today (UTC)
const getStartOfToday = () => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now;
};

// Helper: Calculate date N days ago
const getNDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

// Helper: Parse date range query params
const parseDateRange = (range = "30d", customStart, customEnd) => {
  const now = new Date();
  let startDate = new Date();

  if (range === "7d") {
    startDate.setDate(now.getDate() - 7);
  } else if (range === "30d") {
    startDate.setDate(now.getDate() - 30);
  } else if (range === "90d") {
    startDate.setDate(now.getDate() - 90);
  } else if (range === "12m") {
    startDate.setFullYear(now.getFullYear() - 1);
  } else if (range === "custom" && customStart) {
    startDate = new Date(customStart);
    if (customEnd) {
      const end = new Date(customEnd);
      end.setUTCHours(23, 59, 59, 999);
      return { startDate, endDate: end };
    }
  } else {
    startDate.setDate(now.getDate() - 30);
  }

  return { startDate, endDate: now };
};

/**
 * 1. Overview KPIs
 * Real live metrics computed strictly from active database collections.
 */
export const getOverview = async (req, res) => {
  try {
    const startOfToday = getStartOfToday();
    const sevenDaysAgo = getNDaysAgo(7);
    const thirtyDaysAgo = getNDaysAgo(30);
    const oneDayAgo = getNDaysAgo(1);

    // Concurrent database aggregations for optimal performance
    const [
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      totalLoginsFromEvents,
      usersWithLoginSum,
      loginsToday,
      loginsThisWeek,
      loginsThisMonth,
      totalApplications,
      totalFeedback,
      resumeUploadEvents,
      aiFeatureEvents,
      dauCount,
      wauCount,
      mauCount,
    ] = await Promise.all([
      // Users KPIs
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

      // Logins KPIs
      AnalyticsEvent.countDocuments({ eventType: "login" }),
      User.aggregate([
        { $group: { _id: null, total: { $sum: "$loginCount" } } },
      ]),
      AnalyticsEvent.countDocuments({
        eventType: "login",
        timestamp: { $gte: startOfToday },
      }),
      AnalyticsEvent.countDocuments({
        eventType: "login",
        timestamp: { $gte: sevenDaysAgo },
      }),
      AnalyticsEvent.countDocuments({
        eventType: "login",
        timestamp: { $gte: thirtyDaysAgo },
      }),

      // Applications & Feedback
      JobApplication.countDocuments(),
      Feedback.countDocuments(),

      // Telemetry Events
      AnalyticsEvent.countDocuments({ eventType: "resume_upload" }),
      AnalyticsEvent.countDocuments({
        eventType: {
          $in: [
            "resume_analyze",
            "resume_generate",
            "job_match",
            "cover_letter_generate",
            "career_guidance",
            "interview_practice",
            "ai_workspace_action",
          ],
        },
      }),

      // Active Users (DAU / WAU / MAU)
      AnalyticsEvent.distinct("userId", {
        timestamp: { $gte: oneDayAgo },
        userId: { $ne: null },
      }).then((ids) => ids.length),
      AnalyticsEvent.distinct("userId", {
        timestamp: { $gte: sevenDaysAgo },
        userId: { $ne: null },
      }).then((ids) => ids.length),
      AnalyticsEvent.distinct("userId", {
        timestamp: { $gte: thirtyDaysAgo },
        userId: { $ne: null },
      }).then((ids) => ids.length),
    ]);

    // Total logins calculation (fallback to sum of loginCount if telemetry event count is lower)
    const sumUserLogins = usersWithLoginSum[0]?.total || 0;
    const totalLogins = Math.max(totalLoginsFromEvents, sumUserLogins);

    // Unique users who logged in
    const uniqueUsersLoggedIn = await AnalyticsEvent.distinct("userId", {
      eventType: "login",
      userId: { $ne: null },
    }).then((ids) => ids.length);

    // Total saved jobs
    const totalSavedJobs = await JobApplication.countDocuments({
      status: "Saved",
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
          newThisMonth: newUsersThisMonth,
        },
        logins: {
          total: totalLogins,
          uniqueUsers: uniqueUsersLoggedIn || (totalUsers > 0 ? 1 : 0),
          today: loginsToday,
          thisWeek: loginsThisWeek,
          thisMonth: loginsThisMonth,
        },
        activeUsers: {
          dau: dauCount || (newUsersToday > 0 ? newUsersToday : 0),
          wau: wauCount || (newUsersThisWeek > 0 ? newUsersThisWeek : 0),
          mau: mauCount || (newUsersThisMonth > 0 ? newUsersThisMonth : 0),
        },
        applications: {
          total: totalApplications,
          saved: totalSavedJobs,
        },
        resumes: {
          totalUploads: resumeUploadEvents,
        },
        ai: {
          totalFeatureUses: aiFeatureEvents,
        },
        feedback: {
          totalSubmissions: totalFeedback,
        },
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Admin Analytics Overview Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch overview analytics.",
      error: error.message,
    });
  }
};

/**
 * 2. User Registrations & User Management Table
 */
export const getUserAnalytics = async (req, res) => {
  try {
    const {
      range = "30d",
      startDate: customStart,
      endDate: customEnd,
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      filterRole = "all",
    } = req.query;

    const { startDate, endDate } = parseDateRange(range, customStart, customEnd);

    // 1. Registration Timeline Aggregation
    const registrationTrend = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
    ]);

    // Compute cumulative sum and growth %
    let cumulative = 0;
    const formattedTimeline = registrationTrend.map((item) => {
      cumulative += item.count;
      return {
        date: item.date,
        count: item.count,
        cumulative,
      };
    });

    // Compute growth vs previous period
    const periodDuration = endDate.getTime() - startDate.getTime();
    const prevStartDate = new Date(startDate.getTime() - periodDuration);
    const prevEndDate = new Date(startDate.getTime());

    const [currentPeriodCount, prevPeriodCount] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      User.countDocuments({ createdAt: { $gte: prevStartDate, $lte: prevEndDate } }),
    ]);

    let growthPercentage = 0;
    if (prevPeriodCount > 0) {
      growthPercentage = Number(
        (((currentPeriodCount - prevPeriodCount) / prevPeriodCount) * 100).toFixed(1)
      );
    } else if (currentPeriodCount > 0) {
      growthPercentage = 100;
    }

    // 2. Paginated Users List Query
    const userQuery = {};
    if (search && search.trim()) {
      const term = search.trim();
      userQuery.$or = [
        { name: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
      ];
    }

    if (filterRole === "admin") {
      userQuery.$or = [{ isAdmin: true }, { role: "admin" }];
    } else if (filterRole === "user") {
      userQuery.isAdmin = { $ne: true };
      userQuery.role = { $ne: "admin" };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    const sortField = [
      "createdAt",
      "lastLoginAt",
      "loginCount",
      "lastActiveAt",
      "name",
      "email",
    ].includes(sortBy)
      ? sortBy
      : "createdAt";
    sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;

    const [totalUsersCount, rawUsers] = await Promise.all([
      User.countDocuments(userQuery),
      User.find(userQuery)
        .select("-password")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    // Enhance users with application counts & AI event counts efficiently
    const userIds = rawUsers.map((u) => u._id);

    const [appCounts, aiCounts] = await Promise.all([
      JobApplication.aggregate([
        { $match: { createdBy: { $in: userIds } } },
        { $group: { _id: "$createdBy", count: { $sum: 1 } } },
      ]),
      AnalyticsEvent.aggregate([
        {
          $match: {
            userId: { $in: userIds },
            eventType: {
              $in: [
                "resume_analyze",
                "resume_generate",
                "job_match",
                "cover_letter_generate",
                "career_guidance",
                "interview_practice",
                "ai_workspace_action",
              ],
            },
          },
        },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ]),
    ]);

    const computeSessionStatus = (u) => {
      const lastLogin = u.lastLoginAt ? new Date(u.lastLoginAt).getTime() : (u.createdAt ? new Date(u.createdAt).getTime() : 0);
      const lastLogout = u.lastLogoutAt ? new Date(u.lastLogoutAt).getTime() : 0;
      const lastActive = u.lastActiveAt ? new Date(u.lastActiveAt).getTime() : lastLogin;
      const now = Date.now();
      const fifteenMinutes = 15 * 60 * 1000;

      if (lastLogout >= lastLogin && lastLogout > 0) {
        return {
          status: "logged_out",
          label: "Logged Out",
          isOnline: false,
        };
      }

      if (lastLogin > 0) {
        if (now - lastActive <= fifteenMinutes) {
          return {
            status: "online",
            label: "Active Now",
            isOnline: true,
          };
        } else {
          return {
            status: "logged_in",
            label: "Still Logged In",
            isOnline: true,
          };
        }
      }

      return {
        status: "offline",
        label: "Offline",
        isOnline: false,
      };
    };

    const users = rawUsers.map((u) => {
      const session = computeSessionStatus(u);
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        isAdmin: !!u.isAdmin || u.role === "admin",
        role: u.role || (u.isAdmin ? "admin" : "user"),
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt || u.createdAt,
        lastLogoutAt: u.lastLogoutAt || null,
        lastActiveAt: u.lastActiveAt || u.lastLoginAt || u.createdAt,
        isOnline: session.isOnline,
        sessionStatus: session.status,
        sessionLabel: session.label,
        loginCount: u.loginCount || 1,
        applicationCount: appMap.get(String(u._id)) || 0,
        aiUsageCount: aiMap.get(String(u._id)) || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        trend: formattedTimeline,
        growthPercentage,
        currentPeriodCount,
        prevPeriodCount,
        pagination: {
          total: totalUsersCount,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalUsersCount / limitNum) || 1,
        },
        users,
      },
    });
  } catch (error) {
    console.error("[Admin Analytics Users Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user registration analytics.",
      error: error.message,
    });
  }
};

/**
 * 3. Login Analytics
 */
export const getLoginAnalytics = async (req, res) => {
  try {
    const { range = "30d", startDate: customStart, endDate: customEnd } = req.query;
    const { startDate, endDate } = parseDateRange(range, customStart, customEnd);
    const startOfToday = getStartOfToday();
    const sevenDaysAgo = getNDaysAgo(7);
    const thirtyDaysAgo = getNDaysAgo(30);

    const [
      totalLoginsCount,
      uniqueUsersCount,
      loginsToday,
      loginsThisWeek,
      loginsThisMonth,
      dailyTrend,
      returningUsersCount,
      totalUsers,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ eventType: "login" }),
      AnalyticsEvent.distinct("userId", {
        eventType: "login",
        userId: { $ne: null },
      }).then((ids) => ids.length),
      AnalyticsEvent.countDocuments({
        eventType: "login",
        timestamp: { $gte: startOfToday },
      }),
      AnalyticsEvent.countDocuments({
        eventType: "login",
        timestamp: { $gte: sevenDaysAgo },
      }),
      AnalyticsEvent.countDocuments({
        eventType: "login",
        timestamp: { $gte: thirtyDaysAgo },
      }),
      AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: "login",
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            totalLogins: { $sum: 1 },
            uniqueUsersList: { $addToSet: "$userId" },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id",
            totalLogins: 1,
            uniqueUsers: { $size: "$uniqueUsersList" },
          },
        },
      ]),
      User.countDocuments({ loginCount: { $gt: 1 } }),
      User.countDocuments(),
    ]);

    const returningUsersRate =
      totalUsers > 0
        ? Number(((returningUsersCount / totalUsers) * 100).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLogins: totalLoginsCount,
        uniqueUsers: uniqueUsersCount || (totalUsers > 0 ? 1 : 0),
        loginsToday,
        loginsThisWeek,
        loginsThisMonth,
        returningUsersRate,
        returningUsersCount,
        dailyTrend,
      },
    });
  } catch (error) {
    console.error("[Admin Analytics Login Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch login analytics.",
      error: error.message,
    });
  }
};

/**
 * 4. Feature Usage Rankings
 */
export const getFeatureAnalytics = async (req, res) => {
  try {
    const featuresAggregate = await AnalyticsEvent.aggregate([
      {
        $group: {
          _id: "$eventType",
          usageCount: { $sum: 1 },
          uniqueUsersList: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          _id: 0,
          eventType: "$_id",
          usageCount: 1,
          uniqueUsers: {
            $size: {
              $filter: {
                input: "$uniqueUsersList",
                as: "u",
                cond: { $ne: ["$$u", null] },
              },
            },
          },
        },
      },
      { $sort: { usageCount: -1 } },
    ]);

    // Map internal event types to clean display labels
    const FEATURE_META = {
      job_search: { name: "Job Search & Discovery", category: "Jobs" },
      job_save: { name: "Save Job to Tracker", category: "Jobs" },
      job_view: { name: "Job Description Analyzer", category: "Jobs" },
      application_create: { name: "Application Tracking", category: "Applications" },
      application_status_change: { name: "Status Kanban Updates", category: "Applications" },
      resume_upload: { name: "Resume Upload & Parser", category: "Resumes" },
      resume_analyze: { name: "Resume ATS Audit", category: "AI Tools" },
      resume_generate: { name: "AI Resume Generator", category: "AI Tools" },
      job_match: { name: "Job Match Scoring", category: "AI Tools" },
      cover_letter_generate: { name: "Cover Letter Generator", category: "AI Tools" },
      career_guidance: { name: "AI Career Coach", category: "AI Tools" },
      interview_practice: { name: "Mock Interview Simulator", category: "AI Tools" },
      ai_workspace_action: { name: "AI Workspace Suite", category: "AI Tools" },
      feedback_submit: { name: "Feedback Submissions", category: "Support" },
      login: { name: "User Authentication", category: "Auth" },
      register: { name: "User Registrations", category: "Auth" },
    };

    const rankings = featuresAggregate.map((item) => ({
      eventType: item.eventType,
      name: FEATURE_META[item.eventType]?.name || item.eventType,
      category: FEATURE_META[item.eventType]?.category || "General",
      usageCount: item.usageCount,
      uniqueUsers: item.uniqueUsers,
    }));

    res.status(200).json({
      success: true,
      data: {
        rankings,
      },
    });
  } catch (error) {
    console.error("[Admin Analytics Feature Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feature usage analytics.",
      error: error.message,
    });
  }
};

/**
 * 5. Dedicated AI Analytics
 */
export const getAIAnalytics = async (req, res) => {
  try {
    const AI_EVENT_TYPES = [
      "resume_analyze",
      "resume_generate",
      "job_match",
      "cover_letter_generate",
      "career_guidance",
      "interview_practice",
      "ai_workspace_action",
    ];

    const thirtyDaysAgo = getNDaysAgo(30);

    const [
      totalAIRequests,
      uniqueAIUsers,
      aiByFeature,
      aiDailyTrend,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ eventType: { $in: AI_EVENT_TYPES } }),
      AnalyticsEvent.distinct("userId", {
        eventType: { $in: AI_EVENT_TYPES },
        userId: { $ne: null },
      }).then((ids) => ids.length),
      AnalyticsEvent.aggregate([
        { $match: { eventType: { $in: AI_EVENT_TYPES } } },
        { $group: { _id: "$eventType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: { $in: AI_EVENT_TYPES },
            timestamp: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
          },
        },
      ]),
    ]);

    const AI_FEATURE_NAMES = {
      resume_analyze: "Resume ATS Audit",
      resume_generate: "AI Resume Builder",
      job_match: "Job Match Scoring",
      cover_letter_generate: "Cover Letter Generator",
      career_guidance: "AI Career Coach",
      interview_practice: "Mock Interview Guide",
      ai_workspace_action: "AI Workspace Actions",
    };

    const formattedFeatureBreakdown = aiByFeature.map((item) => ({
      featureKey: item._id,
      name: AI_FEATURE_NAMES[item._id] || item._id,
      count: item.count,
      percentage:
        totalAIRequests > 0
          ? Number(((item.count / totalAIRequests) * 100).toFixed(1))
          : 0,
    }));

    const mostUsedAIFeature =
      formattedFeatureBreakdown.length > 0
        ? formattedFeatureBreakdown[0].name
        : "None yet";

    res.status(200).json({
      success: true,
      data: {
        totalAIRequests,
        uniqueAIUsers,
        mostUsedAIFeature,
        byFeature: formattedFeatureBreakdown,
        dailyTrend: aiDailyTrend,
      },
    });
  } catch (error) {
    console.error("[Admin Analytics AI Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch AI usage analytics.",
      error: error.message,
    });
  }
};

/**
 * 6. Job & Application Analytics
 */
export const getJobAnalytics = async (req, res) => {
  try {
    const [
      totalSearches,
      totalApplications,
      statusDistribution,
      priorityDistribution,
      topCompanies,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ eventType: "job_search" }),
      JobApplication.countDocuments(),
      JobApplication.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { _id: 0, status: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ]),
      JobApplication.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } },
        { $project: { _id: 0, priority: "$_id", count: 1 } },
      ]),
      JobApplication.aggregate([
        { $group: { _id: "$company", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
        { $project: { _id: 0, company: "$_id", count: 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSearches,
        totalApplications,
        statusDistribution,
        priorityDistribution,
        topCompanies,
      },
    });
  } catch (error) {
    console.error("[Admin Analytics Job Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job and application analytics.",
      error: error.message,
    });
  }
};

/**
 * 7. Resume Analytics
 */
export const getResumeAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = getNDaysAgo(30);

    const [
      totalUploads,
      uniqueUploaders,
      analysisCount,
      generatorUsage,
      recentActivity,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({ eventType: "resume_upload" }),
      AnalyticsEvent.distinct("userId", {
        eventType: "resume_upload",
        userId: { $ne: null },
      }).then((ids) => ids.length),
      AnalyticsEvent.countDocuments({ eventType: "resume_analyze" }),
      AnalyticsEvent.countDocuments({ eventType: "resume_generate" }),
      AnalyticsEvent.aggregate([
        {
          $match: {
            eventType: {
              $in: ["resume_upload", "resume_analyze", "resume_generate"],
            },
            timestamp: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              type: "$eventType",
            },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Transform timeline matrix
    const dateMap = new Map();
    recentActivity.forEach((item) => {
      const d = item._id.date;
      if (!dateMap.has(d)) {
        dateMap.set(d, { date: d, uploads: 0, analyses: 0, generations: 0 });
      }
      const obj = dateMap.get(d);
      if (item._id.type === "resume_upload") obj.uploads += item.count;
      if (item._id.type === "resume_analyze") obj.analyses += item.count;
      if (item._id.type === "resume_generate") obj.generations += item.count;
    });

    const activityOverTime = Array.from(dateMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    res.status(200).json({
      success: true,
      data: {
        totalUploads,
        uniqueUploaders,
        analysisCount,
        generatorUsage,
        activityOverTime,
      },
    });
  } catch (error) {
    console.error("[Admin Analytics Resume Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume analytics.",
      error: error.message,
    });
  }
};

/**
 * 8. Feedback Analytics
 */
export const getFeedbackAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = getNDaysAgo(30);

    const [
      totalFeedback,
      byType,
      deliveredCount,
      recentFeedbackList,
      trendOverTime,
    ] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $project: { _id: 0, type: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ]),
      Feedback.countDocuments({ emailSent: true }),
      Feedback.find()
        .sort({ createdAt: -1 })
        .limit(15)
        .lean(),
      Feedback.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
          },
        },
      ]),
    ]);

    const sanitizedRecent = recentFeedbackList.map((f) => ({
      id: f._id,
      authorName: f.authorName || "Anonymous",
      email: f.email || "Not provided",
      type: f.type || "suggestion",
      message: f.message || "",
      pageUrl: f.pageUrl || "",
      emailSent: !!f.emailSent,
      deliveryStatus: f.deliveryStatus || (f.emailSent ? "delivered" : "logged"),
      emailError: f.emailError || null,
      emailProvider: f.emailProvider || (f.emailSent ? "resend" : null),
      deliveredAt: f.deliveredAt || null,
      createdAt: f.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: {
        total: totalFeedback,
        byType,
        deliveredToAdminCount: deliveredCount,
        recent: sanitizedRecent,
        trend: trendOverTime,
      },
    });
  } catch (error) {
    console.error("[Admin Analytics Feedback Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback analytics.",
      error: error.message,
    });
  }
};

/**
 * 9. Individual User Detail View
 * Provides aggregate stats & sanitized activity timeline for an individual user.
 * NEVER exposes user passwords, JWTs, or private raw resume content.
 */
export const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID format.",
      });
    }

    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const [
      totalApplications,
      statusBreakdown,
      aiEventsCount,
      feedbackCount,
      recentEvents,
      sessionEvents,
    ] = await Promise.all([
      JobApplication.countDocuments({ createdBy: id }),
      JobApplication.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(id) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { _id: 0, status: "$_id", count: 1 } },
      ]),
      AnalyticsEvent.countDocuments({
        userId: id,
        eventType: {
          $in: [
            "resume_analyze",
            "resume_generate",
            "job_match",
            "cover_letter_generate",
            "career_guidance",
            "interview_practice",
            "ai_workspace_action",
          ],
        },
      }),
      Feedback.countDocuments({ userId: id }),
      AnalyticsEvent.find({ userId: id })
        .sort({ timestamp: -1 })
        .limit(25)
        .select("eventType timestamp metadata")
        .lean(),
      AnalyticsEvent.find({
        userId: id,
        eventType: { $in: ["login", "logout", "register"] },
      })
        .sort({ timestamp: -1 })
        .limit(20)
        .select("eventType timestamp metadata")
        .lean(),
    ]);

    const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt).getTime() : (user.createdAt ? new Date(user.createdAt).getTime() : 0);
    const lastLogout = user.lastLogoutAt ? new Date(user.lastLogoutAt).getTime() : 0;
    const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt).getTime() : lastLogin;
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;

    let sessionStatus = "offline";
    let sessionLabel = "Offline";
    let isOnline = false;

    if (lastLogout >= lastLogin && lastLogout > 0) {
      sessionStatus = "logged_out";
      sessionLabel = "Logged Out";
      isOnline = false;
    } else if (lastLogin > 0) {
      if (now - lastActive <= fifteenMinutes) {
        sessionStatus = "online";
        sessionLabel = "Active Now";
        isOnline = true;
      } else {
        sessionStatus = "logged_in";
        sessionLabel = "Still Logged In";
        isOnline = true;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: !!user.isAdmin || user.role === "admin",
          role: user.role || (user.isAdmin ? "admin" : "user"),
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt || user.createdAt,
          lastLogoutAt: user.lastLogoutAt || null,
          lastActiveAt: user.lastActiveAt || user.lastLoginAt || user.createdAt,
          isOnline,
          sessionStatus,
          sessionLabel,
          loginCount: user.loginCount || 1,
        },
        metrics: {
          totalApplications,
          statusBreakdown,
          totalAIEvents: aiEventsCount,
          totalFeedbackSubmitted: feedbackCount,
        },
        sessionHistory: sessionEvents.map((s) => ({
          eventType: s.eventType,
          timestamp: s.timestamp,
          summary:
            s.eventType === "login"
              ? "User logged into account"
              : s.eventType === "logout"
              ? "User logged out"
              : "Account created & initial login",
        })),
        recentActivity: recentEvents.map((e) => ({
          eventType: e.eventType,
          timestamp: e.timestamp,
          summary:
            e.metadata?.feature ||
            e.metadata?.role ||
            e.metadata?.company ||
            e.metadata?.query ||
            e.eventType,
        })),
      },
    });
  } catch (error) {
    console.error("[Admin Analytics User Detail Error]:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user detail.",
      error: error.message,
    });
  }
};

export default {
  getOverview,
  getUserAnalytics,
  getLoginAnalytics,
  getFeatureAnalytics,
  getAIAnalytics,
  getJobAnalytics,
  getResumeAnalytics,
  getFeedbackAnalytics,
  getUserDetail,
};
