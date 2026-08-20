import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import jobRoutes from "./routes/jobRoutes.js";
import jobSearchRoutes from "./routes/jobSearchRoutes.js";
import { getDebugJobs } from "./controllers/jobSearchController.js";
import aiRoutes from "./routes/aiRoutes.js";
import aiInterviewRoutes from "./routes/aiInterviewRoutes.js";
import coverLetterRoutes from "./routes/coverLetterRoutes.js";
import careerCoachRoutes from "./routes/careerCoachRoutes.js";
import jobAnalyzerRoutes from "./routes/jobAnalyzerRoutes.js";
import aiWorkspaceRoutes from "./routes/aiWorkspaceRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GetHired AI API Engine Running 🚀",
  });
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user,
  });
});

app.get("/api/debug/jobs", authMiddleware, getDebugJobs);

app.use("/resume", resumeRoutes);
app.use("/jobs", jobsRoutes);
app.use("/interview", interviewRoutes);
app.use("/community", communityRoutes);
app.use("/auth", authRoutes);

app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/community", communityRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobs", jobSearchRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai", aiInterviewRoutes);
app.use("/api/ai", coverLetterRoutes);
app.use("/api/ai", careerCoachRoutes);
app.use("/api/ai", jobAnalyzerRoutes);
app.use("/api/ai/workspace", aiWorkspaceRoutes);

export default app;