import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    authorName: {
      type: String,
      default: "Anonymous User",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: ["bug", "suggestion", "question", "other"],
      default: "suggestion",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    pageUrl: {
      type: String,
      trim: true,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    deliveryStatus: {
      type: String,
      enum: ["delivered", "failed", "logged"],
      default: "logged",
    },
    emailError: {
      type: String,
      default: null,
    },
    emailProvider: {
      type: String,
      default: null,
    },
    emailMessageId: {
      type: String,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Feedback", feedbackSchema);
