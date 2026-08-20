import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    targetSection: {
      type: String,
      enum: [
        "General",
        "Summary / Intro",
        "Work Experience",
        "Skills & Tech Stack",
        "Education & Certs",
        "Formatting & Tone",
      ],
      default: "General",
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    upvoteCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const sharedDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    documentType: {
      type: String,
      enum: ["resume", "cover_letter", "other"],
      default: "resume",
    },
    targetRole: {
      type: String,
      default: "Software Engineer",
      trim: true,
    },
    targetCompany: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["private", "shared"],
      default: "shared",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    feedbackList: [feedbackSchema],
    feedbackCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

sharedDocumentSchema.index({ visibility: 1, createdAt: -1 });
sharedDocumentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("SharedDocument", sharedDocumentSchema);
