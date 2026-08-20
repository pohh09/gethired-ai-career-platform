import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getSharedDocuments,
  getSharedDocumentById,
  createSharedDocument,
  toggleDocumentVisibility,
  addFeedback,
  toggleFeedbackUpvote,
  getMyStreak,
  logUserActivity,
  getCohortStreaks,
  updateStreakPrivacy,
  getSuccessStories,
  createSuccessStory,
  toggleCongratsReaction,
  getQuestions,
  createQuestion,
  toggleQuestionUpvote,
  addAnswer,
} from "../controllers/communityController.js";

const router = express.Router();

// Peer Feedback (Shared Documents)
router.get("/documents", authMiddleware, getSharedDocuments);
router.get("/documents/:id", authMiddleware, getSharedDocumentById);
router.post("/documents", authMiddleware, createSharedDocument);
router.patch("/documents/:id/visibility", authMiddleware, toggleDocumentVisibility);
router.post("/documents/:id/feedback", authMiddleware, addFeedback);
router.post("/documents/:id/feedback/:feedbackId/upvote", authMiddleware, toggleFeedbackUpvote);

// Progress & Accountability Streaks
router.get("/streaks/me", authMiddleware, getMyStreak);
router.post("/streaks/activity", authMiddleware, logUserActivity);
router.get("/streaks/cohort", authMiddleware, getCohortStreaks);
router.patch("/streaks/preferences", authMiddleware, updateStreakPrivacy);

// Success Stories
router.get("/stories", authMiddleware, getSuccessStories);
router.post("/stories", authMiddleware, createSuccessStory);
router.post("/stories/:id/congrats", authMiddleware, toggleCongratsReaction);

// Community Q&A
router.get("/qa", authMiddleware, getQuestions);
router.post("/qa", authMiddleware, createQuestion);
router.post("/qa/:id/upvote", authMiddleware, toggleQuestionUpvote);
router.post("/qa/:id/answers", authMiddleware, addAnswer);

export default router;
