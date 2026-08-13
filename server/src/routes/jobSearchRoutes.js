import express from "express";
import {
  searchDiscoverJobs,
  importJobExtract,
  getDebugJobs,
} from "../controllers/jobSearchController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/discover", authMiddleware, searchDiscoverJobs);

router.post("/import/extract", authMiddleware, importJobExtract);

router.get("/debug", authMiddleware, getDebugJobs);

export default router;
