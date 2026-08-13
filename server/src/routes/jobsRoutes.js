import express from "express";
import { validateBody } from "../middleware/validationMiddleware.js";
import * as controller from "../controllers/aiWorkspaceController.js";

const router = express.Router();

// POST /jobs/analyze
router.post("/analyze", validateBody(["jobDescription"]), controller.analyzeJobDescription);

// POST /jobs/match
router.post("/match", validateBody(["resumeText", "jobDescription"]), controller.matchResumeWithJob);

// POST /jobs/cover-letter
router.post("/cover-letter", validateBody(["resumeText", "jobDescription"]), controller.generateCoverLetter);

// POST /jobs/follow-up
router.post("/follow-up", controller.generateFollowUpEmail);

// POST /jobs/salary
router.post("/salary", validateBody(["role", "location"]), controller.estimateSalary);

// POST /jobs/company
router.post("/company", validateBody(["companyName"]), controller.researchCompany);

export default router;
