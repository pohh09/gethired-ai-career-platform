import express from "express";
import Feedback from "../models/Feedback.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendFeedbackEmail } from "../services/emailService.js";

const router = express.Router();

// Optional auth: try to extract user if token present
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      authMiddleware(req, res, next);
      return;
    } catch {
      // Continue unauthenticated
    }
  }
  next();
};

// POST /api/feedback - Submit feedback (authenticated or guest) and deliver by email
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { type, message, authorName, email, pageUrl } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const feedbackDoc = new Feedback({
      userId: req.user?._id || req.user?.id || null,
      authorName: authorName || req.user?.name || "GetHired User",
      email: email || req.user?.email || "",
      type: ["bug", "suggestion", "question", "other"].includes(type) ? type : "suggestion",
      message: message.trim(),
      pageUrl: pageUrl || "",
    });

    await feedbackDoc.save();

    // Trigger email notification asynchronously to the site admin/owner
    sendFeedbackEmail({
      type: feedbackDoc.type,
      message: feedbackDoc.message,
      authorName: feedbackDoc.authorName,
      email: feedbackDoc.email,
      pageUrl: feedbackDoc.pageUrl,
      userId: feedbackDoc.userId,
    })
      .then(async (emailResult) => {
        if (emailResult?.success && !emailResult.simulated) {
          feedbackDoc.emailSent = true;
          await feedbackDoc.save();
        }
      })
      .catch((err) => {
        console.warn("[Feedback Route] Email notification failed:", err.message);
      });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully and sent to the team. Thank you!",
      feedback: feedbackDoc,
    });
  } catch (err) {
    console.error("[Feedback Route Error]:", err.message);
    return res.status(500).json({ error: "Failed to save feedback" });
  }
});

export default router;

