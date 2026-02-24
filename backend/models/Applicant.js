const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{ type: String, trim: true }],
  experience: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Applicant', applicantSchema);
