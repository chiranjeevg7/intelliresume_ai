import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import env from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

const analysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    resumeStrengthScore: { type: SchemaType.NUMBER },
    atsScore: { type: SchemaType.NUMBER },
    jobMatchScore: { type: SchemaType.NUMBER },
    skillStrength: { type: SchemaType.NUMBER },

    analysis: {
      type: SchemaType.OBJECT,
      properties: {
        resumeStructure: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING },
          },
          required: ["score", "reasoning"],
        },
        contentQuality: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING },
          },
          required: ["score", "reasoning"],
        },
        skillRelevance: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING },
          },
          required: ["score", "reasoning"],
        },
        experienceQuality: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING },
          },
          required: ["score", "reasoning"],
        },
        projectQuality: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING },
          },
          required: ["score", "reasoning"],
        },
        educationQuality: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING },
          },
          required: ["score", "reasoning"],
        },
        professionalism: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING },
          },
          required: ["score", "reasoning"],
        },
        atsCompatibility: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING },
          },
          required: ["score", "reasoning"],
        },
        recruiterReadability: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            reasoning: { type: SchemaType.STRING },
          },
          required: ["score", "reasoning"],
        },
      },
      required: [
        "resumeStructure",
        "contentQuality",
        "skillRelevance",
        "experienceQuality",
        "projectQuality",
        "educationQuality",
        "professionalism",
        "atsCompatibility",
        "recruiterReadability",
      ],
    },

    jobMatch: {
      type: SchemaType.OBJECT,
      properties: {
        matchingSkills: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        missingSkills: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        experienceGap: { type: SchemaType.STRING },
        recommendations: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        reasoning: { type: SchemaType.STRING },
      },
      required: [
        "matchingSkills",
        "missingSkills",
        "experienceGap",
        "recommendations",
        "reasoning",
      ],
    },

    careerRecommendations: {
      type: SchemaType.OBJECT,
      properties: {
        recommendedRoles: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              reason: { type: SchemaType.STRING },
            },
            required: ["title", "reason"],
          },
        },
        careerPaths: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        growthOpportunities: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        futureLearningRoadmap: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: [
        "recommendedRoles",
        "careerPaths",
        "growthOpportunities",
        "futureLearningRoadmap",
      ],
    },

    skillGapAnalysis: {
      type: SchemaType.OBJECT,
      properties: {
        currentSkills: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        missingSkills: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        highDemandSkills: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        learningPriority: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        roadmap30Days: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        roadmap60Days: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        roadmap90Days: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: [
        "currentSkills",
        "missingSkills",
        "highDemandSkills",
        "learningPriority",
        "roadmap30Days",
        "roadmap60Days",
        "roadmap90Days",
      ],
    },

    interviewPreparation: {
      type: SchemaType.OBJECT,
      properties: {
        technicalQuestions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              question: { type: SchemaType.STRING },
              modelAnswer: { type: SchemaType.STRING },
            },
            required: ["question", "modelAnswer"],
          },
        },
        hrQuestions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              question: { type: SchemaType.STRING },
              modelAnswer: { type: SchemaType.STRING },
            },
            required: ["question", "modelAnswer"],
          },
        },
        projectQuestions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              question: { type: SchemaType.STRING },
              modelAnswer: { type: SchemaType.STRING },
            },
            required: ["question", "modelAnswer"],
          },
        },
        scenarioQuestions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              question: { type: SchemaType.STRING },
              modelAnswer: { type: SchemaType.STRING },
            },
            required: ["question", "modelAnswer"],
          },
        },
      },
      required: [
        "technicalQuestions",
        "hrQuestions",
        "projectQuestions",
        "scenarioQuestions",
      ],
    },

    projectAnalysis: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          projectName: { type: SchemaType.STRING },
          complexity: { type: SchemaType.STRING },
          industryRelevance: { type: SchemaType.STRING },
          technicalDepth: { type: SchemaType.STRING },
          resumeImpact: { type: SchemaType.STRING },
          improvements: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: [
          "projectName",
          "complexity",
          "industryRelevance",
          "technicalDepth",
          "resumeImpact",
          "improvements",
        ],
      },
    },

    improvedContent: {
      type: SchemaType.OBJECT,
      properties: {
        summary: { type: SchemaType.STRING },
        experience: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        projects: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        skillsSection: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: ["summary", "experience", "projects", "skillsSection"],
    },

    coverLetter: { type: SchemaType.STRING },

    insights: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },

    improvementAreas: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          area: { type: SchemaType.STRING },
          score: { type: SchemaType.NUMBER },
        },
        required: ["area", "score"],
      },
    },
  },
  required: [
    "resumeStrengthScore",
    "atsScore",
    "jobMatchScore",
    "skillStrength",
    "analysis",
    "jobMatch",
    "careerRecommendations",
    "skillGapAnalysis",
    "interviewPreparation",
    "projectAnalysis",
    "improvedContent",
    "coverLetter",
    "insights",
    "improvementAreas",
  ],
};

const model = genAI.getGenerativeModel({
  model: env.geminiModel || "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: analysisSchema,
    temperature: 0.4,
  },
});

const clampScore = (value, fallback = 0) => {
  const num = Number(value);
  if (Number.isNaN(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
};

const normalizeAnalysis = (data = {}) => ({
  resumeStrengthScore: clampScore(data.resumeStrengthScore, 65),
  atsScore: clampScore(data.atsScore, 60),
  jobMatchScore: clampScore(data.jobMatchScore, 55),
  skillStrength: clampScore(data.skillStrength, 58),

  analysis: data.analysis || {
    resumeStructure: {
      score: 60,
      reasoning: "Structure analysis unavailable.",
    },
    contentQuality: { score: 60, reasoning: "Content analysis unavailable." },
    skillRelevance: { score: 60, reasoning: "Skill analysis unavailable." },
    experienceQuality: {
      score: 60,
      reasoning: "Experience analysis unavailable.",
    },
    projectQuality: { score: 60, reasoning: "Project analysis unavailable." },
    educationQuality: {
      score: 60,
      reasoning: "Education analysis unavailable.",
    },
    professionalism: {
      score: 60,
      reasoning: "Professionalism analysis unavailable.",
    },
    atsCompatibility: { score: 60, reasoning: "ATS analysis unavailable." },
    recruiterReadability: {
      score: 60,
      reasoning: "Readability analysis unavailable.",
    },
  },

  jobMatch: {
    matchingSkills: data.jobMatch?.matchingSkills || [],
    missingSkills: data.jobMatch?.missingSkills || [],
    experienceGap: data.jobMatch?.experienceGap || "Not enough information.",
    recommendations: data.jobMatch?.recommendations || [],
    reasoning: data.jobMatch?.reasoning || "Job match reasoning unavailable.",
  },

  careerRecommendations: {
    recommendedRoles: data.careerRecommendations?.recommendedRoles || [],
    careerPaths: data.careerRecommendations?.careerPaths || [],
    growthOpportunities: data.careerRecommendations?.growthOpportunities || [],
    futureLearningRoadmap:
      data.careerRecommendations?.futureLearningRoadmap || [],
  },

  skillGapAnalysis: {
    currentSkills: data.skillGapAnalysis?.currentSkills || [],
    missingSkills: data.skillGapAnalysis?.missingSkills || [],
    highDemandSkills: data.skillGapAnalysis?.highDemandSkills || [],
    learningPriority: data.skillGapAnalysis?.learningPriority || [],
    roadmap30Days: data.skillGapAnalysis?.roadmap30Days || [],
    roadmap60Days: data.skillGapAnalysis?.roadmap60Days || [],
    roadmap90Days: data.skillGapAnalysis?.roadmap90Days || [],
  },

  interviewPreparation: {
    technicalQuestions: data.interviewPreparation?.technicalQuestions || [],
    hrQuestions: data.interviewPreparation?.hrQuestions || [],
    projectQuestions: data.interviewPreparation?.projectQuestions || [],
    scenarioQuestions: data.interviewPreparation?.scenarioQuestions || [],
  },

  projectAnalysis: data.projectAnalysis || [],

  improvedContent: {
    summary: data.improvedContent?.summary || "",
    experience: data.improvedContent?.experience || [],
    projects: data.improvedContent?.projects || [],
    skillsSection: data.improvedContent?.skillsSection || [],
  },

  coverLetter: data.coverLetter || "",
  insights: data.insights || [],
  improvementAreas: data.improvementAreas || [],
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableGeminiError = (error) => {
  const message = error?.message || "";
  return (
    message.includes("503 Service Unavailable") ||
    message.includes("currently experiencing high demand") ||
    message.includes("overloaded") ||
    message.includes("UNAVAILABLE")
  );
};

export const generateResumeAnalysis = async (prompt) => {
  const maxAttempts = 4;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (parseError) {
        console.error("Gemini returned invalid JSON:", text);
        throw new Error(`Failed to parse Gemini JSON: ${parseError.message}`);
      }

      return normalizeAnalysis(parsed);
    } catch (error) {
      lastError = error;
      console.error(`Gemini attempt ${attempt} failed:`, error.message);

      if (!isRetryableGeminiError(error) || attempt === maxAttempts) {
        break;
      }

      const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
      await sleep(delay);
    }
  }

  throw new Error(
    `Gemini analysis failed after retries: ${lastError?.message || "Unknown error"}`,
  );
};
