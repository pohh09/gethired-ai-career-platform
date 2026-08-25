import express from "express";
import jwt from "jsonwebtoken";
import Feedback from "../models/Feedback.js";
import { sendFeedbackEmail } from "../services/emailService.js";
import { trackEvent } from "../services/analyticsService.js";

const router = express.Router();

// Simple in-memory IP rate limiter to protect against spam / flooding
const recentSubmissions = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 5;

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown_ip";
  const now = Date.now();
  const timestamps = (recentSubmissions.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: "Too many feedback submissions from this IP. Please wait a moment before sending again.",
    });
  }

  timestamps.push(now);
  recentSubmissions.set(ip, timestamps);
  next();
};

// Optional auth: safely extract authenticated user context without blocking guests
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch {
      // Continue unauthenticated if token invalid/expired
    }
  }
  next();
};

// GET /api/feedback/diagnostic - Safe diagnostic check for email delivery service configuration
router.get("/diagnostic", (req, res) => {
  const hasResend = !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0;
  const keyPrefix = hasResend ? process.env.RESEND_API_KEY.trim().slice(0, 5) + "..." : "missing";
  const recipient = (process.env.FEEDBACK_RECEIVER_EMAIL || process.env.ADMIN_EMAIL || "poojadaki09@gmail.com").trim();
  const fromEmail = (process.env.RESEND_FROM || process.env.SMTP_FROM || "GetHired Feedback <onboarding@resend.dev>").trim();

  return res.status(200).json({
    success: true,
    emailService: {
      provider: hasResend ? "resend" : "none (database logging only)",
      resendConfigured: hasResend,
      resendKeyPrefix: keyPrefix,
      receiverEmail: recipient,
      fromAddress: fromEmail,
      timestamp: new Date().toISOString(),
    },
  });
});

// POST /api/feedback - Submit feedback (authenticated or guest) and deliver by email to poojadaki09@gmail.com
router.post("/", optionalAuth, rateLimiter, async (req, res) => {
  try {
    const { type, message, authorName, email, pageUrl } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback message is required and cannot be empty.",
      });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Feedback message exceeds maximum allowed limit of 5,000 characters.",
      });
    }

    const validTypes = ["bug", "suggestion", "question", "other"];
    const sanitizedType = validTypes.includes(type) ? type : "suggestion";
    const sanitizedAuthor = (typeof authorName === "string" ? authorName.trim() : "") || req.user?.name || "Anonymous";
    const sanitizedEmail = (typeof email === "string" ? email.trim() : "") || req.user?.email || "";
    const sanitizedPageUrl = typeof pageUrl === "string" ? pageUrl.trim() : "";
    const authenticatedUserId = req.user?.userId || req.user?._id || req.user?.id || null;

    const feedbackDoc = new Feedback({
      userId: authenticatedUserId,
      authorName: sanitizedAuthor,
      email: sanitizedEmail,
      type: sanitizedType,
      message: trimmedMessage,
      pageUrl: sanitizedPageUrl,
      emailSent: false,
      deliveryStatus: "logged",
    });

    await feedbackDoc.save();

    // Telemetry tracking
    trackEvent(authenticatedUserId, "feedback_submit", {
      type: sanitizedType,
      feedbackId: feedbackDoc._id,
    });

    // Trigger email notification to recipient (poojadaki09@gmail.com)
    try {
      const emailResult = await sendFeedbackEmail({
        type: sanitizedType,
        message: trimmedMessage,
        authorName: sanitizedAuthor,
        email: sanitizedEmail,
        pageUrl: sanitizedPageUrl,
        userId: authenticatedUserId,
      });

      if (emailResult?.delivered) {
        feedbackDoc.emailSent = true;
        feedbackDoc.deliveryStatus = "delivered";
        feedbackDoc.emailProvider = emailResult.provider || "resend";
        feedbackDoc.emailMessageId = emailResult.messageId || null;
        feedbackDoc.emailError = null;
        feedbackDoc.deliveredAt = new Date();
      } else {
        feedbackDoc.emailSent = false;
        feedbackDoc.deliveryStatus = emailResult?.simulated ? "logged" : "failed";
        feedbackDoc.emailProvider = emailResult?.provider || "none";
        feedbackDoc.emailError = emailResult?.error || "Email delivery was not completed";
      }

      await feedbackDoc.save();
    } catch (emailErr) {
      console.error("[Feedback Route] Email delivery exception:", emailErr.message);
      feedbackDoc.deliveryStatus = "failed";
      feedbackDoc.emailError = emailErr.message;
      await feedbackDoc.save().catch(() => {});
    }

    return res.status(201).json({
      success: true,
      message: feedbackDoc.emailSent
        ? "Thanks! Your feedback has been sent successfully."
        : "Feedback received and logged into system.",
      data: {
        id: feedbackDoc._id,
        type: feedbackDoc.type,
        emailSent: feedbackDoc.emailSent,
        deliveryStatus: feedbackDoc.deliveryStatus,
      },
    });
  } catch (err) {
    console.error("[Feedback Route Error]:", err.message);
    return res.status(500).json({
      success: false,
      message: "Unable to send feedback. Please try again.",
    });
  }
});

export default router;


