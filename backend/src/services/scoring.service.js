const normalize = (value) => Math.max(0, Math.min(100, Math.round(value || 0)));

export const enrichScores = (analysis) => {
  const a = analysis.analysis || {};
  const sectionScores = Object.values(a).map((item) => item?.score || 0);
  const averagedResume = sectionScores.length
    ? sectionScores.reduce((sum, value) => sum + value, 0) /
      sectionScores.length
    : analysis.resumeStrengthScore || 0;

  return {
    ...analysis,
    resumeStrengthScore: normalize(
      analysis.resumeStrengthScore || averagedResume,
    ),
    atsScore: normalize(
      analysis.atsScore ||
        ((a.atsCompatibility?.score || 0) +
          (a.recruiterReadability?.score || 0)) /
          2,
    ),
    jobMatchScore: normalize(analysis.jobMatchScore || 0),
    skillStrength: normalize(
      analysis.skillStrength || a.skillRelevance?.score || 0,
    ),
  };
};
