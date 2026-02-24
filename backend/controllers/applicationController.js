const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Applicant = require('../models/Applicant');
const Recruiter = require('../models/Recruiter');
const { extractTextFromPDF, calculateScreeningScore } = require('../services/screeningService');
const { sendShortlistEmail } = require('../services/emailService');
const path = require('path');

const applyToJob = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Resume (PDF) is required' });

    const applicant = await Applicant.findOne({ user: req.user._id });
    if (!applicant) return res.status(404).json({ message: 'Applicant profile not found' });

    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== 'active') return res.status(404).json({ message: 'Job not found or closed' });

    // Check duplicate application
    const existing = await Application.findOne({ job: job._id, applicant: applicant._id });
    if (existing) return res.status(400).json({ message: 'You have already applied to this job' });

    // Extract text and calculate screening score
    const filePath = req.file.path;
    const extractedText = await extractTextFromPDF(filePath);
    const screeningScore = calculateScreeningScore(extractedText, job.requirements);

    const resume = await Resume.create({
      applicant: applicant._id,
      filePath: req.file.filename,
      extractedText
    });

    const application = await Application.create({
      job: job._id,
      applicant: applicant._id,
      resume: resume._id,
      status: 'Applied',
      screeningScore
    });

    res.status(201).json({ ...application.toObject(), screeningScore });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'You have already applied to this job' });
    res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ user: req.user._id });
    if (!applicant) return res.status(404).json({ message: 'Applicant profile not found' });

    const applications = await Application.find({ applicant: applicant._id })
      .populate('job', 'title description location status')
      .populate('resume', 'filePath')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplicationsByJob = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    const job = await Job.findOne({ _id: req.params.jobId, recruiter: recruiter._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const applications = await Application.find({ job: job._id })
      .populate({ path: 'applicant', populate: { path: 'user', select: 'name email' } })
      .populate('resume', 'filePath extractedText')
      .sort({ screeningScore: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const shortlistCandidate = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    const application = await Application.findById(req.params.applicationId)
      .populate({ path: 'job' })
      .populate({ path: 'applicant', populate: { path: 'user', select: 'name email' } });

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Verify recruiter owns the job
    const job = await Job.findOne({ _id: application.job._id, recruiter: recruiter._id });
    if (!job) return res.status(403).json({ message: 'Not authorized' });

    application.status = 'Shortlisted';
    await application.save();

    // Send email notification (non-blocking)
    const applicantUser = application.applicant.user;
    sendShortlistEmail(applicantUser.email, applicantUser.name, application.job.title);

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectCandidate = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    const application = await Application.findById(req.params.applicationId).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const job = await Job.findOne({ _id: application.job._id, recruiter: recruiter._id });
    if (!job) return res.status(403).json({ message: 'Not authorized' });

    application.status = 'Rejected';
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const screenApplication = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    const application = await Application.findById(req.params.applicationId)
      .populate('job')
      .populate('resume');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    const job = await Job.findOne({ _id: application.job._id, recruiter: recruiter._id });
    if (!job) return res.status(403).json({ message: 'Not authorized' });

    application.status = 'Screened';
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  shortlistCandidate,
  rejectCandidate,
  screenApplication
};
