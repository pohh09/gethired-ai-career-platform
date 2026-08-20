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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Feedback", feedbackSchema);
