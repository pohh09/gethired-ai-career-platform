import express from "express";
import { validateBody } from "../middleware/validationMiddleware.js";
import * as controller from "../controllers/aiWorkspaceController.js";

const router = express.Router();


router.post("/analyze", validateBody(["jobDescription"]), controller.analyzeJobDescription);

router.post("/match", validateBody(["resumeText", "jobDescription"]), controller.matchResumeWithJob);

router.post("/cover-letter", validateBody(["resumeText", "jobDescription"]), controller.generateCoverLetter);

router.post("/follow-up", controller.generateFollowUpEmail);

router.post("/salary", validateBody(["role", "location"]), controller.estimateSalary);

router.post("/company", validateBody(["companyName"]), controller.researchCompany);

export default router;
