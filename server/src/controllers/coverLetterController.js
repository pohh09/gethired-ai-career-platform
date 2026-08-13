import { generateCoverLetterWithAI } from "../services/coverLetterService.js";

export async function generateCoverLetter(req, res) {
  try {
    const { company, role, jobDescription, resumeText, style, experienceLevel, length, userName, userEmail } = req.body;

    if (!company || typeof company !== "string" || !company.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required for cover letter generation.",
      });
    }

    if (!role || typeof role !== "string" || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title / role is required for cover letter generation.",
      });
    }

    const result = await generateCoverLetterWithAI({
      company,
      role,
      jobDescription: jobDescription || "",
      resumeText: resumeText || "",
      style: style || "Professional",
      experienceLevel: experienceLevel || "Senior",
      length: length || "Medium",
      userName: userName || req.user?.name || "",
      userEmail: userEmail || req.user?.email || "",
    });

    return res.status(200).json({
      success: true,
      message: "AI Cover Letter generated successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate cover letter with AI.",
      error: error.message,
    });
  }
}
