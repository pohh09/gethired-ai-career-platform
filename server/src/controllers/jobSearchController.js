import { fetchDiscoverJobs, getJobSearchDebugStats } from "../services/jobSearchService.js";
import { extractJobData } from "../services/jobImportService.js";
import { trackEvent } from "../services/analyticsService.js";

export const searchDiscoverJobs = async (req, res) => {
  try {
    const {
      query,
      role,
      skill,
      company,
      keywords,
      location,
      workplaceType,
      employmentType,
      sortBy,
      page = 1,
    } = req.query;

    const filters = {
      query,
      role,
      skill,
      company,
      keywords,
      location,
      workplaceType,
      employmentType,
      sortBy,
      page: Number(page),
    };

    const jobs = await fetchDiscoverJobs(filters);

    // Telemetry tracking
    const userId = req.user?.userId || null;
    trackEvent(userId, "job_search", {
      query: query || role || skill || keywords || "",
      location: location || "",
      resultsCount: jobs.length,
    });

    res.set("Cache-Control", "no-store");
    res.status(200).json({
      success: true,
      count: jobs.length,
      page: Number(page),
      data: jobs,
    });
  } catch (error) {
    console.error("Error in searchDiscoverJobs controller:", error);
    res.status(200).json({
      success: false,
      count: 0,
      message: "Failed to fetch live job search results",
      data: [],
      error: error.message,
    });
  }
};

export const importJobExtract = async (req, res) => {
  try {
    const { url, text } = req.body;

    if (!url && !text) {
      return res.status(400).json({
        success: false,
        message: "Please provide either a job URL or job description text.",
      });
    }

    const extractedJob = await extractJobData({ url, text });

    res.status(200).json({
      success: true,
      data: extractedJob,
    });
  } catch (error) {
    console.error("Error in importJobExtract controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to extract job details",
      error: error.message,
    });
  }
};

export const getDebugJobs = async (req, res) => {
  try {
    const stats = getJobSearchDebugStats();
    res.set("Cache-Control", "no-store");
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error in getDebugJobs controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch debug jobs stats",
      error: error.message,
    });
  }
};
