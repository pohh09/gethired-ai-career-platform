import express from "express";
import { matchResume, optimizeResume } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/match-resume", authMiddleware, matchResume);

router.post("/optimize-resume", authMiddleware, optimizeResume);

export default router;
