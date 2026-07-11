import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { getAdminAnalytics } from "../services/analytics.service.js";
import User from "../models/User.model.js";
import Resume from "../models/Resume.model.js";
import Analysis from "../models/Analysis.model.js";
import { buildPdfReport } from "../services/pdfReport.service.js";

export const getDashboard = asyncHandler(async (_req, res) => {
  const analytics = await getAdminAnalytics();
  res.json({ success: true, analytics });
});

export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({})
    .select("name email role createdAt")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, users });
});

export const getAllResumes = asyncHandler(async (_req, res) => {
  const resumes = await Resume.find({})
    .populate("user", "name email role")
    .select("originalFileName mimeType extractedData createdAt user")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, resumes });
});

export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id)
    .populate("user", "name email role")
    .lean();

  if (!resume) throw new ApiError(404, "Resume not found");

  res.json({ success: true, resume });
});

export const getAllAnalyses = asyncHandler(async (_req, res) => {
  const analyses = await Analysis.find({})
    .populate("user", "name email role")
    .populate("resume", "originalFileName extractedData")
    .select("analysisType jobDescription results createdAt user resume")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, analyses });
});

export const getAnalysisById = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id)
    .populate("user", "name email role")
    .populate("resume", "originalFileName extractedData")
    .lean();

  if (!analysis) throw new ApiError(404, "Analysis not found");

  res.json({ success: true, analysis });
});

export const downloadAdminPdfReport = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findById(req.params.id).populate(
    "user",
    "name email role",
  );

  if (!analysis) throw new ApiError(404, "Analysis not found");

  const resume = await Resume.findById(analysis.resume);
  if (!resume) throw new ApiError(404, "Resume not found");

  const buffer = await buildPdfReport({
    user: analysis.user,
    resume,
    analysis: analysis.results,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="intelliresume-admin-report-${analysis._id}.pdf"`,
  );
  res.send(buffer);
});
