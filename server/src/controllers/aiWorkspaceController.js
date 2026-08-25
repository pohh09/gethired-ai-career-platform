import * as resumeService from "../services/ai/resumeAIService.js";
import * as jobService from "../services/ai/jobAnalysisAIService.js";
import * as interviewService from "../services/ai/interviewAIService.js";
import * as careerService from "../services/ai/careerAIService.js";
import * as chatService from "../services/ai/chatAIService.js";
import * as companyService from "../services/ai/companyService.js";
import * as adminService from "../services/ai/adminService.js";
import { parseUploadedDocument } from "../services/ai/documentParserService.js";
import { trackEvent } from "../services/analyticsService.js";

export async function parseDocument(req, res) {
  try {
    console.log("[Upload Debug] req.file:", req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferSize: req.file.buffer ? req.file.buffer.length : 0
    } : "UNDEFINED");
    console.log("[Upload Debug] req.body:", req.body);

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }
    const result = await parseUploadedDocument(req.file);
    const userId = req.user?.userId || null;
    trackEvent(userId, "resume_upload", {
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      wordCount: result?.wordCount || 0,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[Upload Debug Error]:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function parseResume(req, res) {
  try {
    if (req.file) {
      const result = await parseUploadedDocument(req.file);
      const userId = req.user?.userId || null;
      trackEvent(userId, "resume_upload", {
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      });
      return res.json({ success: true, data: result });
    }
    const { resumeText } = req.body || {};
    const result = await resumeService.parseResume(resumeText);
    const userId = req.user?.userId || null;
    trackEvent(userId, "resume_analyze", { feature: "parse_resume" });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function calculateATSScore(req, res) {
  try {
    const { resumeText, targetRole } = req.body;
    const result = await resumeService.calculateATSScore(resumeText, targetRole);
    const userId = req.user?.userId || null;
    trackEvent(userId, "resume_analyze", {
      feature: "ats_score",
      targetRole: targetRole || "General",
      atsScore: result?.atsScore || result?.overallScore || null,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function auditResume(req, res) {
  try {
    const { resumeText, targetRole } = req.body;
    const result = await resumeService.auditResume(resumeText, targetRole);
    const userId = req.user?.userId || null;
    trackEvent(userId, "resume_analyze", {
      feature: "audit_resume",
      targetRole: targetRole || "General",
      score: result?.score || result?.overallScore || null,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function analyzeResume(req, res) {
  try {
    const { resumeText } = req.body;
    const result = await resumeService.analyzeResume(resumeText);
    const userId = req.user?.userId || null;
    trackEvent(userId, "resume_analyze", { feature: "deep_analysis" });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function tailorResume(req, res) {
  try {
    const { resumeText, jobDescription } = req.body;
    const result = await resumeService.tailorResume(resumeText, jobDescription);
    const userId = req.user?.userId || null;
    trackEvent(userId, "resume_generate", { feature: "tailor_resume" });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function generateResume(req, res) {
  try {
    const profileData = req.body.profileData || req.body;
    const result = await resumeService.generateResume(profileData);
    const userId = req.user?.userId || null;
    trackEvent(userId, "resume_generate", {
      feature: "resume_builder_ai",
      role: profileData?.targetRole || profileData?.role || "Software Engineer",
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function optimizeBullets(req, res) {
  try {
    const bulletsText = req.body.bullet || req.body.bulletsText || req.body.text;
    const result = await resumeService.optimizeBullets(bulletsText);
    const userId = req.user?.userId || null;
    trackEvent(userId, "resume_analyze", { feature: "star_bullet_optimizer" });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function improveSection(req, res) {
  try {
    const { section, content, targetRole } = req.body;
    const result = await resumeService.improveSection({ section, content, targetRole });
    const userId = req.user?.userId || null;
    trackEvent(userId, "resume_analyze", { feature: "section_improver", section });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function analyzeJobDescription(req, res) {
  try {
    const jobTextOrUrl = req.body.jobDescription || req.body.jobTextOrUrl || req.body.text;
    const result = await jobService.analyzeJobDescription(jobTextOrUrl);
    const userId = req.user?.userId || null;
    trackEvent(userId, "job_view", { feature: "job_description_analysis" });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function explainJob(req, res) {
  try {
    const jobText = req.body.jobDescription || req.body.text;
    const result = await jobService.explainJob(jobText);
    const userId = req.user?.userId || null;
    trackEvent(userId, "job_view", { feature: "explain_job" });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function matchResumeWithJob(req, res) {
  try {
    const { resumeText, jobDescription } = req.body;
    const result = await jobService.matchResumeWithJob(resumeText, jobDescription);
    const userId = req.user?.userId || null;
    trackEvent(userId, "job_match", {
      matchScore: result?.matchScore || result?.score || null,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function generateCoverLetter(req, res) {
  try {
    const { resumeText, jobDescription, companyName, roleTitle } = req.body;
    const result = await jobService.generateCoverLetter(resumeText, jobDescription, companyName, roleTitle);
    const userId = req.user?.userId || null;
    trackEvent(userId, "cover_letter_generate", {
      companyName: companyName || "",
      roleTitle: roleTitle || "",
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function generateFollowUpEmail(req, res) {
  try {
    const { companyName, roleTitle, candidateName, type } = req.body;
    const result = await jobService.generateFollowUpEmail(companyName, roleTitle, candidateName, type);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function researchCompany(req, res) {
  try {
    const { companyName } = req.body;
    const result = await jobService.researchCompany(companyName);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function estimateSalary(req, res) {
  try {
    const { role, location, skills, experience } = req.body;
    const result = await jobService.estimateSalaryInsights(role, location, skills, experience);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function generateSkillGap(req, res) {
  try {
    const { missingSkills, targetRole } = req.body;
    const result = await jobService.generateSkillGapRoadmap(missingSkills, targetRole);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getInterviewQuestions(req, res) {
  try {
    const { type, role, company, difficulty, resumeText, jobDescription, count } = req.body;
    const result = await interviewService.generateInterviewQuestions({ type, role, company, difficulty, resumeText, jobDescription, count: count || 12 });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function evaluateInterview(req, res) {
  try {
    const { question, userAnswer, role, roundType, difficulty, strongAnswerContains, importantPoints, commonMistakes, scoringRubric, resumeText } = req.body;
    const result = await interviewService.evaluateInterviewResponse({ question, userAnswer, role, roundType, difficulty, strongAnswerContains, importantPoints, commonMistakes, scoringRubric, resumeText });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function generateAdaptiveNextQuestion(req, res) {
  try {
    const { previousQuestion, previousAnswer, previousScore, currentDifficulty, role, type, resumeText, jobDescription, questionNumber, totalQuestions } = req.body;
    const result = await interviewService.generateAdaptiveNextQuestion({ previousQuestion, previousAnswer, previousScore, currentDifficulty, role, type, resumeText, jobDescription, questionNumber, totalQuestions });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function generateFinalInterviewReport(req, res) {
  try {
    const { sessionHistory, role, type } = req.body;
    const result = await interviewService.generateFinalInterviewReport({ sessionHistory, role, type });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function reviewPortfolio(req, res) {
  try {
    const { input } = req.body;
    const result = await careerService.reviewPortfolio(input);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function reviewGitHub(req, res) {
  try {
    const { input } = req.body;
    const result = await careerService.reviewGitHub(input);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function reviewLinkedIn(req, res) {
  try {
    const { input } = req.body;
    const result = await careerService.reviewLinkedIn(input);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function generateCareerRoadmap(req, res) {
  try {
    const { currentRole, targetGoal } = req.body;
    const result = await careerService.generateCareerRoadmap(currentRole, targetGoal);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getCompanyDetails(req, res) {
  try {
    const { name } = req.query;
    const result = await companyService.getCompanyDetails(name);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getAdminMetrics(req, res) {
  try {
    const result = await adminService.getAdminMetrics();
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function processChat(req, res) {
  try {
    const {
      message,
      contextTab,
      history,
      activeResumeText,
      activeJobDescription,
      targetRole,
      interviewRound,
      difficulty,
      companyName
    } = req.body;

    const result = await chatService.processChatMessage({
      message,
      contextTab,
      history,
      activeResumeText,
      activeJobDescription,
      targetRole,
      interviewRound,
      difficulty,
      companyName
    });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[Chat Controller Error]:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}
