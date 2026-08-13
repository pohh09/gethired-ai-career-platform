import { generateInterviewPrepWithAI } from "../services/aiInterviewService.js";

export async function generateInterviewPrep(req, res) {
  try {
    const { company, role, jobDescription, resumeText } = req.body;

    if (!company || typeof company !== "string" || !company.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required for interview preparation.",
      });
    }

    if (!role || typeof role !== "string" || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job role title is required for interview preparation.",
      });
    }

    const result = await generateInterviewPrepWithAI({
      company,
      role,
      jobDescription: jobDescription || "",
      resumeText: resumeText || "",
    });

    return res.status(200).json({
      success: true,
      message: "AI Interview preparation guide generated successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI interview preparation.",
      error: error.message,
    });
  }
}
