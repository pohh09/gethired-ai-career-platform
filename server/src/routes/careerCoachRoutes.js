import express from "express";
import { getCareerCoachAnalysis } from "../controllers/careerCoachController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/career-coach", authMiddleware, getCareerCoachAnalysis);

export default router;
