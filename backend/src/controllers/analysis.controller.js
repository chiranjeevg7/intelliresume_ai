import Analysis from "../models/Analysis.model.js";
import Resume from "../models/Resume.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateResumeAnalysis } from "../services/gemini.service.js";

const buildPrompt = ({ resume, jobDescription }) => {
  const extracted = resume.extractedData || {};

  return `
You are IntelliResume AI, an expert recruiter, ATS analyst, career strategist, and resume reviewer.

Analyze the following candidate resume deeply using semantic understanding, not simple keyword counting.

Return only valid JSON that matches the requested schema.

Resume raw text:
${resume.rawText?.slice(0, 12000) || ""}

Structured extracted data:
${JSON.stringify(extracted, null, 2)}

Job description:
${jobDescription || "No job description provided. In that case, evaluate general market fit and recommend suitable roles."}

Scoring rules:
- All scores must be between 0 and 100.
- Be realistic, evidence-based, and specific.
- Evaluate structure, content quality, professionalism, ATS compatibility, recruiter readability, experience depth, project relevance, and education quality.
- Identify missing skills and recommend improvements.
- Suggest realistic job roles and a 30/60/90-day learning roadmap.
- Generate interview questions with model answers.
- Improve summary, experience, projects, and skills section.
- Generate a personalized cover letter.
- Provide concise and actionable insights.
`;
};

export const createAnalysis = asyncHandler(async (req, res) => {
  const { resumeId, jobDescription = "" } = req.body;

  if (!resumeId) {
    throw new ApiError(400, "resumeId is required");
  }

  const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (!resume.rawText || !resume.rawText.trim()) {
    throw new ApiError(
      400,
      "Resume text could not be extracted from the uploaded file",
    );
  }

  try {
    const prompt = buildPrompt({ resume, jobDescription });
    const results = await generateResumeAnalysis(prompt);

    const analysis = await Analysis.create({
      user: req.user._id,
      resume: resume._id,
      jobDescription,
      analysisType: "full",
      results,
    });

    return res.status(201).json({
      success: true,
      message: "AI analysis generated successfully",
      analysis,
    });
  } catch (error) {
    console.error("Analysis controller error:", error);

    const isHighDemand =
      error.message?.includes("503") ||
      error.message?.includes("high demand") ||
      error.message?.includes("UNAVAILABLE");

    throw new ApiError(
      isHighDemand ? 503 : 500,
      isHighDemand
        ? "AI service is busy right now. Please try again in a few moments."
        : error.message || "Failed to generate analysis",
    );
  }
});

export const getAnalyses = asyncHandler(async (req, res) => {
  const analyses = await Analysis.find({ user: req.user._id })
    .populate("resume", "originalFileName extractedData createdAt")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    analyses,
  });
});

export const getAnalysisById = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("resume", "originalFileName extractedData createdAt");

  if (!analysis) {
    throw new ApiError(404, "Analysis not found");
  }

  res.json({
    success: true,
    analysis,
  });
});
