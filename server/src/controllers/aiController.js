import { matchResumeWithAI, optimizeResumeWithAI } from "../services/aiService.js";

export async function matchResume(req, res) {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide resume content for matching.",
      });
    }

    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a job description for matching.",
      });
    }

    const result = await matchResumeWithAI(resumeText, jobDescription);

    return res.status(200).json({
      success: true,
      message: "AI Resume Match analysis complete.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to perform AI Resume Match.",
      error: error.message,
    });
  }
}

export async function optimizeResume(req, res) {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide resume text to analyze.",
      });
    }

    if (resumeText.length > 50000) {
      return res.status(400).json({
        success: false,
        message: "Resume content exceeds maximum allowed size (50KB text limit).",
      });
    }

    const result = await optimizeResumeWithAI(resumeText, jobDescription || "");

    return res.status(200).json({
      success: true,
      message: "AI Resume Optimization analysis complete.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to optimize resume with AI.",
      error: error.message,
    });
  }
}
