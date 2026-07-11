export const SYSTEM_PROMPT = `You are IntelliResume AI, an expert ATS analyst, recruiter, career strategist, resume writer, and interviewer.
Return only strict JSON.
Do not use keyword counting as the primary logic.
Use semantic reasoning about resume quality, structure, experience depth, project complexity, education relevance, communication quality, and suitability for the target job.
Always produce balanced, actionable, evidence-based recommendations.`;

export const buildFullAnalysisPrompt = ({
  resumeText,
  extractedData,
  jobDescription,
}) => `
Analyze this resume and return strict JSON with the following shape:
{
  "resumeStrengthScore": number,
  "atsScore": number,
  "jobMatchScore": number,
  "skillStrength": number,
  "analysis": {
    "resumeStructure": { "score": number, "reasoning": string },
    "contentQuality": { "score": number, "reasoning": string },
    "skillRelevance": { "score": number, "reasoning": string },
    "experienceQuality": { "score": number, "reasoning": string },
    "projectQuality": { "score": number, "reasoning": string },
    "educationQuality": { "score": number, "reasoning": string },
    "professionalism": { "score": number, "reasoning": string },
    "atsCompatibility": { "score": number, "reasoning": string },
    "recruiterReadability": { "score": number, "reasoning": string }
  },
  "jobMatch": {
    "matchingSkills": string[],
    "missingSkills": string[],
    "experienceGap": string,
    "recommendations": string[],
    "reasoning": string
  },
  "careerRecommendations": {
    "recommendedRoles": [{ "title": string, "reason": string }],
    "careerPaths": string[],
    "growthOpportunities": string[],
    "futureLearningRoadmap": string[]
  },
  "skillGapAnalysis": {
    "currentSkills": string[],
    "missingSkills": string[],
    "highDemandSkills": string[],
    "learningPriority": string[],
    "roadmap30Days": string[],
    "roadmap60Days": string[],
    "roadmap90Days": string[]
  },
  "interviewPreparation": {
    "technicalQuestions": [{ "question": string, "modelAnswer": string }],
    "hrQuestions": [{ "question": string, "modelAnswer": string }],
    "projectQuestions": [{ "question": string, "modelAnswer": string }],
    "scenarioQuestions": [{ "question": string, "modelAnswer": string }]
  },
  "projectAnalysis": [{
    "name": string,
    "complexity": string,
    "industryRelevance": string,
    "technicalDepth": string,
    "resumeImpact": string,
    "improvementSuggestions": string[]
  }],
  "improvedContent": {
    "summary": string,
    "experience": string[],
    "projects": string[],
    "skillsSection": string[]
  },
  "coverLetter": string,
  "insights": string[],
  "improvementAreas": [{ "area": string, "score": number }]
}

Resume extracted data:
${JSON.stringify(extractedData, null, 2)}

Resume text:
${resumeText}

Job description:
${jobDescription || "No job description provided. Use a general professional baseline and infer best-fit roles from the resume."}
`;
