import express from "express";
import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getJobStats,
} from "../controllers/jobController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getAllJobs);

router.get("/stats", authMiddleware, getJobStats);

router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

export default router;