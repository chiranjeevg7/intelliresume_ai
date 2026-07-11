import User from "../models/User.model.js";
import Resume from "../models/Resume.model.js";
import Analysis from "../models/Analysis.model.js";

export const getAdminAnalytics = async () => {
  const [users, resumes, analyses, latestUsers, latestResumes, latestAnalyses] =
    await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Analysis.countDocuments(),
      User.find({})
        .select("name email role createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Resume.find({})
        .populate("user", "name email")
        .select("originalFileName extractedData createdAt user")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Analysis.find({})
        .populate("user", "name email")
        .populate("resume", "originalFileName")
        .select("analysisType createdAt user resume")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  return {
    totals: {
      users,
      resumes,
      analyses,
    },
    latestUsers,
    latestResumes,
    latestAnalyses,
  };
};
