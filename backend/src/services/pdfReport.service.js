import PDFDocument from "pdfkit";

export const buildPdfReport = ({ user, resume, analysis }) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(22).text("IntelliResume AI Report", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Candidate: ${resume.extractedData.name || user.name}`);
    doc.text(`Email: ${resume.extractedData.email || user.email}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(16).text("Scores");
    doc
      .fontSize(12)
      .text(`Resume Strength Score: ${analysis.resumeStrengthScore}/100`)
      .text(`ATS Score: ${analysis.atsScore}/100`)
      .text(`Job Match Score: ${analysis.jobMatchScore}/100`)
      .text(`Skill Strength: ${analysis.skillStrength}/100`);

    doc.moveDown().fontSize(16).text("Insights");
    (analysis.insights || []).forEach((item) =>
      doc.fontSize(11).text(`• ${item}`),
    );

    doc.moveDown().fontSize(16).text("Recommendations");
    (analysis.jobMatch?.recommendations || []).forEach((item) =>
      doc.fontSize(11).text(`• ${item}`),
    );

    doc.moveDown().fontSize(16).text("Career Roadmap");
    doc.fontSize(12).text("30 Days");
    (analysis.skillGapAnalysis?.roadmap30Days || []).forEach((item) =>
      doc.fontSize(11).text(`• ${item}`),
    );
    doc.fontSize(12).text("60 Days");
    (analysis.skillGapAnalysis?.roadmap60Days || []).forEach((item) =>
      doc.fontSize(11).text(`• ${item}`),
    );
    doc.fontSize(12).text("90 Days");
    (analysis.skillGapAnalysis?.roadmap90Days || []).forEach((item) =>
      doc.fontSize(11).text(`• ${item}`),
    );

    doc.addPage().fontSize(16).text("Interview Questions");
    (analysis.interviewPreparation?.technicalQuestions || [])
      .slice(0, 6)
      .forEach((item, index) => {
        doc.fontSize(12).text(`${index + 1}. ${item.question}`);
        doc
          .fontSize(10)
          .fillColor("#555")
          .text(item.modelAnswer)
          .fillColor("#000");
        doc.moveDown(0.5);
      });

    doc.end();
  });
