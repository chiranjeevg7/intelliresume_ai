import path from "path";
import Resume from "../models/Resume.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  parseResumeFile,
  extractStructuredData,
} from "../services/parser.service.js";
import ApiError from "../utils/ApiError.js";

export const uploadAndParseResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Resume file is required");

  const rawText = await parseResumeFile(req.file.path, req.file.mimetype);
  const extractedData = extractStructuredData(rawText);

  const resume = await Resume.create({
    user: req.user._id,
    originalFileName: req.file.originalname,
    storedFileName: req.file.filename,
    mimeType: req.file.mimetype,
    filePath: path.resolve(req.file.path),
    rawText,
    extractedData,
  });

  res.status(201).json({ success: true, resume });
});

export const getMyResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, resumes });
});

export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!resume) throw new ApiError(404, "Resume not found");
  res.json({ success: true, resume });
});
