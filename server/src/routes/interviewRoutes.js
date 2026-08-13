import express from "express";
import * as controller from "../controllers/aiWorkspaceController.js";

const router = express.Router();

// POST /interview/session & POST /interview/questions
router.post("/session", controller.getInterviewQuestions);
router.post("/questions", controller.getInterviewQuestions);

// POST /interview/evaluate
router.post("/evaluate", controller.evaluateInterview);

// POST /interview/adaptive-next
router.post("/adaptive-next", controller.generateAdaptiveNextQuestion);

// POST /interview/report
router.post("/report", controller.generateFinalInterviewReport);

export default router;
