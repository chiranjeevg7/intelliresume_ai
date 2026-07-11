import Analysis from "../models/Analysis.model.js";
import Resume from "../models/Resume.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildPdfReport } from "../services/pdfReport.service.js";

export const downloadPdfReport = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!analysis) throw new ApiError(404, "Analysis not found");

  const resume = await Resume.findById(analysis.resume);
  const buffer = await buildPdfReport({
    user: req.user,
    resume,
    analysis: analysis.results,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="intelliresume-report-${analysis._id}.pdf"`,
  );
  res.send(buffer);
});
