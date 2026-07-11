import { Router } from "express";
import {
  getMyResumes,
  getResumeById,
  uploadAndParseResume,
} from "../controllers/resume.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadResume } from "../middleware/upload.middleware.js";

const router = Router();
router.use(protect);
router.post("/upload", uploadResume.single("resume"), uploadAndParseResume);
router.get("/", getMyResumes);
router.get("/:id", getResumeById);

export default router;
