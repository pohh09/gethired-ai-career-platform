import express from "express";
import { generateInterviewPrep } from "../controllers/aiInterviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/interview-prep", authMiddleware, generateInterviewPrep);

export default router;
