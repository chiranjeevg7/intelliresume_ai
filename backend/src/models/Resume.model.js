import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalFileName: { type: String, required: true },
    storedFileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    filePath: { type: String, required: true },
    rawText: { type: String, required: true },
    extractedData: {
      name: String,
      email: String,
      phone: String,
      skills: [String],
      education: [String],
      experience: [String],
      projects: [String],
      certifications: [String],
      achievements: [String],
      summary: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Resume", resumeSchema);
