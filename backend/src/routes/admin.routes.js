import { Router } from "express";
import {
  getDashboard,
  getAllUsers,
  getAllResumes,
  getResumeById,
  getAllAnalyses,
  getAnalysisById,
  downloadAdminPdfReport,
} from "../controllers/admin.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);
router.get("/users", getAllUsers);
router.get("/resumes", getAllResumes);
router.get("/resumes/:id", getResumeById);
router.get("/analyses", getAllAnalyses);
router.get("/analyses/:id", getAnalysisById);
router.get("/reports/:id/pdf", downloadAdminPdfReport);

export default router;
