import mongoose from "mongoose";

const successStorySchema = new mongoose.Schema(
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
    storyType: {
      type: String,
      enum: ["offer", "interview", "milestone"],
      default: "interview",
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    story: {
      type: String,
      required: true,
      trim: true,
    },
    tips: {
      type: String,
      default: "",
      trim: true,
    },
    congrats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    congratsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

successStorySchema.index({ createdAt: -1 });
successStorySchema.index({ storyType: 1, createdAt: -1 });

export default mongoose.model("SuccessStory", successStorySchema);
