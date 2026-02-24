const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: true },
  filePath: { type: String, required: true },
  extractedText: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
