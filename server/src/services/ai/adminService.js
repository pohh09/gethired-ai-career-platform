export async function getAdminMetrics() {
  return {
    overview: {
      totalUsers: 14250,
      activeUsersToday: 1840,
      totalJobsTracked: 89400,
      aiExecutionsToday: 6420,
      systemUptime: "99.98%",
    },
    aiUsage: {
      totalTokensConsumed: "42.8 Million Tokens",
      requestsThisMonth: 148500,
      mostUsedTool: "Resume ATS Analyzer & Job Matcher",
      averageResponseLatency: "480ms",
      apiCostSavings: "₹1,24,000 via caching layer",
    },
    featureFlags: {
      enableGemini15Flash: true,
      enableJoobleIndiaSearch: true,
      enableBrowserExtensionAdapter: true,
      enableKanbanDragAndDrop: true,
      enablePDFExport: true,
    },
    recentReports: [
      { id: "rep-1", title: "Monthly Job Application & Response Rate Benchmark", date: "2026-08-01", status: "Generated" },
      { id: "rep-2", title: "AI Token Consumption & Provider Health Audit", date: "2026-08-05", status: "Completed" },
    ],
  };
}
