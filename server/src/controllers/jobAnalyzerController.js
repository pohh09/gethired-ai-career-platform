import { analyzeJobDescriptionWithAI } from "../services/jobAnalyzerService.js";

export async function analyzeJobDescription(req, res) {
  try {
    const { jobTitle, company, jobDescription, resumeText } = req.body;

    if (!jobTitle || typeof jobTitle !== "string" || !jobTitle.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job Title is required for analysis.",
      });
    }

    if (!company || typeof company !== "string" || !company.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company Name is required for analysis.",
      });
    }

    const result = await analyzeJobDescriptionWithAI({
      jobTitle: jobTitle.trim(),
      company: company.trim(),
      jobDescription: jobDescription || "",
      resumeText: resumeText || "",
      userName: req.user?.name || "",
    });

    return res.status(200).json({
      success: true,
      message: "Job description analyzed successfully with AI.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to analyze job description with AI.",
      error: error.message,
    });
  }
}
