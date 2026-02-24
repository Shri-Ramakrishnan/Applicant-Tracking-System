const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organization: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Recruiter', recruiterSchema);
