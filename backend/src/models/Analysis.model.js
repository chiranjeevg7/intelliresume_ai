import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobDescription: { type: String, default: "" },
    analysisType: {
      type: String,
      enum: [
        "full",
        "job-match",
        "career",
        "interview",
        "cover-letter",
        "improvement",
      ],
      default: "full",
    },
    results: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Analysis", analysisSchema);
