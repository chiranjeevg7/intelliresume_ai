import fs from "fs/promises";
import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_REGEX = /(\+?\d[\d\s\-()]{8,}\d)/;

const splitBullets = (text) =>
  text
    .split(/\n|•|\-|\*/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2);

const extractSection = (text, heading) => {
  const regex = new RegExp(
    `${heading}[\\s\\S]*?(?=\\n[A-Z][A-Za-z ]{2,}:?|$)`,
    "i",
  );
  const match = text.match(regex);
  return match
    ? splitBullets(match[0].replace(new RegExp(heading, "i"), ""))
    : [];
};

export const parseResumeFile = async (filePath, mimeType) => {
  const buffer = await fs.readFile(filePath);
  if (mimeType.includes("pdf")) {
    const parsed = await pdf(buffer);
    return parsed.text;
  }
  if (mimeType.includes("word") || path.extname(filePath) === ".docx") {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value;
  }
  throw new Error("Unsupported file format");
};

export const extractStructuredData = (rawText) => {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const name = lines[0] || "Unknown Candidate";
  const email = rawText.match(EMAIL_REGEX)?.[0] || "";
  const phone = rawText.match(PHONE_REGEX)?.[0] || "";
  const skills = extractSection(rawText, "Skills")
    .flatMap((item) => item.split(/,|\//))
    .map((item) => item.trim())
    .filter(Boolean);
  const education = extractSection(rawText, "Education");
  const experience = extractSection(rawText, "Experience");
  const projects = extractSection(rawText, "Projects");
  const certifications = extractSection(rawText, "Certifications");
  const achievements = extractSection(rawText, "Achievements");
  const summary = extractSection(rawText, "Summary").join(" ");

  return {
    name,
    email,
    phone,
    skills: [...new Set(skills)],
    education,
    experience,
    projects,
    certifications,
    achievements,
    summary,
  };
};
