const pdfParse = require('pdf-parse');
const fs = require('fs');

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`PDF parse error: ${error.message}`);
    return '';
  }
};

const calculateScreeningScore = (resumeText, jobRequirements) => {
  if (!resumeText || !jobRequirements) return 0;

  const resumeLower = resumeText.toLowerCase();
  const requirementWords = jobRequirements
    .toLowerCase()
    .split(/[\s,;.]+/)
    .filter(word => word.length > 3);

  if (requirementWords.length === 0) return 0;

  const matchedWords = requirementWords.filter(word => resumeLower.includes(word));
  const score = Math.round((matchedWords.length / requirementWords.length) * 100);
  return Math.min(score, 100);
};

module.exports = { extractTextFromPDF, calculateScreeningScore };
