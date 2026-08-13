import JobApplication from "../models/JobApplication.js";
import { generateCareerCoachAnalysisWithAI } from "../services/careerCoachService.js";

export async function getCareerCoachAnalysis(req, res) {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    const userJobs = await JobApplication.find({ createdBy: userId }).sort({ createdAt: -1 });

    const result = await generateCareerCoachAnalysisWithAI(userJobs, req.user);

    return res.status(200).json({
      success: true,
      message: "AI Career Coach analysis generated successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI career coach analysis.",
      error: error.message,
    });
  }
}
