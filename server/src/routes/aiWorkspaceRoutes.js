import express from "express";
import multer from "multer";
import * as controller from "../controllers/aiWorkspaceController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/document/parse", upload.single("file"), controller.parseDocument);

// Resume Workspace Endpoints
router.post("/resume/parse", controller.parseResume);
router.post("/resume/ats-score", controller.calculateATSScore);
router.post("/resume/audit", controller.auditResume);
router.post("/resume/analyze", controller.analyzeResume);
router.post("/resume/tailor", controller.tailorResume);
router.post("/resume/build", controller.generateResume);
router.post("/resume/generate", controller.generateResume);
router.post("/resume/optimize-bullets", controller.optimizeBullets);
router.post("/resume/star", controller.optimizeBullets);

// Jobs Workspace Endpoints
router.post("/job/analyze", controller.analyzeJobDescription);
router.post("/jobs/analyze", controller.analyzeJobDescription);
router.post("/job/explain", controller.explainJob);
router.post("/jobs/explain", controller.explainJob);
router.post("/job/match", controller.matchResumeWithJob);
router.post("/jobs/match", controller.matchResumeWithJob);
router.post("/job/cover-letter", controller.generateCoverLetter);
router.post("/jobs/cover-letter", controller.generateCoverLetter);
router.post("/job/follow-up-email", controller.generateFollowUpEmail);
router.post("/jobs/follow-up", controller.generateFollowUpEmail);
router.post("/job/company", controller.researchCompany);
router.post("/jobs/company", controller.researchCompany);
router.post("/job/salary", controller.estimateSalary);
router.post("/jobs/salary", controller.estimateSalary);
router.post("/job/skill-gap", controller.generateSkillGap);

// Interview Workspace Endpoints
router.post("/interview/session", controller.getInterviewQuestions);
router.post("/interview/questions", controller.getInterviewQuestions);
router.post("/interview/evaluate", controller.evaluateInterview);
router.post("/interview/adaptive-next", controller.generateAdaptiveNextQuestion);
router.post("/interview/report", controller.generateFinalInterviewReport);

// Career Workspace Endpoints
router.post("/career/portfolio", controller.reviewPortfolio);
router.post("/career/github", controller.reviewGitHub);
router.post("/career/linkedin", controller.reviewLinkedIn);
router.post("/career/roadmap", controller.generateCareerRoadmap);

router.get("/company/details", controller.getCompanyDetails);
router.get("/admin/metrics", controller.getAdminMetrics);

router.post("/chat", controller.processChat);

export default router;
