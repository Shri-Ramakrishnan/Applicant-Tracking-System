const mongoose = require('mongoose');

const interviewScheduleSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  interviewDate: { type: Date, required: true },
  mode: { type: String, enum: ['Online', 'In-person', 'Phone'], default: 'Online' },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('InterviewSchedule', interviewScheduleSchema);
