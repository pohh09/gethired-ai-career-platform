import mongoose from "mongoose";

const activityItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "application_submitted",
        "resume_updated",
        "mock_interview",
        "feedback_given",
        "daily_login",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userStreakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    currentStreak: {
      type: Number,
      default: 1,
    },
    longestStreak: {
      type: Number,
      default: 1,
    },
    lastActiveDate: {
      type: String, // YYYY-MM-DD
      default: () => new Date().toISOString().split("T")[0],
    },
    activeDates: [
      {
        type: String, // YYYY-MM-DD
      },
    ],
    privacy: {
      type: String,
      enum: ["private", "anonymized", "named"],
      default: "named",
    },
    targetWeeklyGoal: {
      type: Number,
      default: 5,
    },
    activities: [activityItemSchema],
  },
  {
    timestamps: true,
  }
);

userStreakSchema.index({ privacy: 1, currentStreak: -1 });

export default mongoose.model("UserStreak", userStreakSchema);
