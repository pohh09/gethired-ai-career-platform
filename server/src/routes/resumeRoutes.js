import express from "express";
import multer from "multer";
import { validateBody } from "../middleware/validationMiddleware.js";
import * as controller from "../controllers/aiWorkspaceController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// POST /resume/upload & POST /resume/parse (File Upload)
router.post("/upload", upload.single("file"), controller.parseDocument);
router.post("/parse", upload.single("file"), controller.parseResume);

// POST /resume/audit
router.post("/audit", validateBody(["resumeText"]), controller.auditResume);

// POST /resume/star
router.post("/star", validateBody(["bullet"]), controller.optimizeBullets);

// POST /resume/generate
router.post("/generate", controller.generateResume);

export default router;
