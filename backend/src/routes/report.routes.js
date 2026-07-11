import { Router } from "express";
import { downloadPdfReport } from "../controllers/report.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect);
router.get("/:id/pdf", downloadPdfReport);

export default router;
