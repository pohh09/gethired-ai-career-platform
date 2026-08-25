import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import * as controller from "../controllers/adminAnalyticsController.js";

const router = express.Router();

// Strict security: All admin analytics routes require both valid JWT and verified admin permissions
router.use(authMiddleware, adminMiddleware);

// Analytics endpoints
router.get("/overview", controller.getOverview);
router.get("/users", controller.getUserAnalytics);
router.get("/logins", controller.getLoginAnalytics);
router.get("/features", controller.getFeatureAnalytics);
router.get("/ai", controller.getAIAnalytics);
router.get("/jobs", controller.getJobAnalytics);
router.get("/resumes", controller.getResumeAnalytics);
router.get("/feedback", controller.getFeedbackAnalytics);
router.get("/users/:id", controller.getUserDetail);

export default router;
