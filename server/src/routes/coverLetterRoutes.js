import express from "express";
import { generateCoverLetter } from "../controllers/coverLetterController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-cover-letter", authMiddleware, generateCoverLetter);

export default router;
