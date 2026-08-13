import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
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

    location: {
      type: String,
      default: "",
    },

    salary: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Screening",
        "Interview",
        "Assessment",
        "HR Round",
        "Offer",
        "Rejected",
      ],
      default: "Applied",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    jobLink: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

jobApplicationSchema.index({ createdBy: 1, createdAt: -1 });
jobApplicationSchema.index({ createdBy: 1, status: 1 });
jobApplicationSchema.index({ createdBy: 1, priority: 1 });
jobApplicationSchema.index({ createdBy: 1, company: 1, role: 1 });

export default mongoose.model("JobApplication", jobApplicationSchema);