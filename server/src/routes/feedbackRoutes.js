import express from "express";
import Feedback from "../models/Feedback.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/feedback - Submit feedback (authenticated or guest)
router.post("/", async (req, res) => {
  try {
    const { type, message, authorName, pageUrl } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const feedbackDoc = new Feedback({
      userId: req.user?._id || req.user?.id || null,
      authorName: authorName || "GetHired User",
      type: ["bug", "suggestion", "question", "other"].includes(type) ? type : "suggestion",
      message: message.trim(),
      pageUrl: pageUrl || "",
    });

    await feedbackDoc.save();

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully. Thank you!",
      feedback: feedbackDoc,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to save feedback" });
  }
});

export default router;
