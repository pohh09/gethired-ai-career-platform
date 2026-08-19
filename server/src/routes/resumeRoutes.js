import express from "express";
import multer from "multer";
import { validateBody } from "../middleware/validationMiddleware.js";
import * as controller from "../controllers/aiWorkspaceController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/upload", upload.single("file"), controller.parseDocument);
router.post("/parse", upload.single("file"), controller.parseResume);


router.post("/audit", validateBody(["resumeText"]), controller.auditResume);


router.post("/star", validateBody(["bullet"]), controller.optimizeBullets);

router.post("/generate", controller.generateResume);

export default router;
