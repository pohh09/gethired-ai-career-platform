import express from "express";
import * as controller from "../controllers/aiWorkspaceController.js";

const router = express.Router();

router.post("/session", controller.getInterviewQuestions);
router.post("/questions", controller.getInterviewQuestions);


router.post("/evaluate", controller.evaluateInterview);


router.post("/adaptive-next", controller.generateAdaptiveNextQuestion);


router.post("/report", controller.generateFinalInterviewReport);

export default router;
