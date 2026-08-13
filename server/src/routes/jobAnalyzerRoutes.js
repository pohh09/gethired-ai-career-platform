import express from "express";
import { analyzeJobDescription } from "../controllers/jobAnalyzerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze-job", authMiddleware, analyzeJobDescription);

export default router;
