const InterviewSchedule = require('../models/InterviewSchedule');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Recruiter = require('../models/Recruiter');
const { sendInterviewEmail } = require('../services/emailService');

const scheduleInterview = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    if (!recruiter) return res.status(404).json({ message: 'Recruiter profile not found' });

    const { applicationId, interviewDate, mode } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate({ path: 'applicant', populate: { path: 'user', select: 'name email' } });

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Verify the recruiter owns this job
    const job = await Job.findOne({ _id: application.job._id, recruiter: recruiter._id });
    if (!job) return res.status(403).json({ message: 'Not authorized' });

    if (!['Shortlisted', 'Screened'].includes(application.status)) {
      return res.status(400).json({ message: 'Candidate must be shortlisted or screened before scheduling' });
    }

    // Check scheduling conflict for same recruiter (1-hour buffer)
    const interviewTime = new Date(interviewDate);
    const bufferMs = 60 * 60 * 1000; // 1 hour

    const conflictingInterview = await InterviewSchedule.findOne({
      recruiter: recruiter._id,
      status: 'Scheduled',
      interviewDate: {
        $gte: new Date(interviewTime.getTime() - bufferMs),
        $lte: new Date(interviewTime.getTime() + bufferMs)
      }
    });

    if (conflictingInterview) {
      return res.status(400).json({
        message: 'Scheduling conflict: Another interview is already scheduled within 1 hour of this time'
      });
    }

    // Check if interview already scheduled for this application
    const existingInterview = await InterviewSchedule.findOne({ application: applicationId, status: 'Scheduled' });
    if (existingInterview) {
      return res.status(400).json({ message: 'Interview already scheduled for this application' });
    }

    const interview = await InterviewSchedule.create({
      application: applicationId,
      recruiter: recruiter._id,
      interviewDate: interviewTime,
      mode: mode || 'Online'
    });

    application.status = 'Interview Scheduled';
    await application.save();

    // Send email notification
    const applicantUser = application.applicant.user;
    sendInterviewEmail(applicantUser.email, applicantUser.name, application.job.title, interviewDate, mode);

    const populated = await InterviewSchedule.findById(interview._id)
      .populate({ path: 'application', populate: 'job' });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInterviewsByRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    const interviews = await InterviewSchedule.find({ recruiter: recruiter._id })
      .populate({
        path: 'application',
        populate: [
          { path: 'job', select: 'title location' },
          { path: 'applicant', populate: { path: 'user', select: 'name email' } }
        ]
      })
      .sort({ interviewDate: 1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInterviewByApplication = async (req, res) => {
  try {
    const interview = await InterviewSchedule.findOne({ application: req.params.applicationId })
      .populate({ path: 'application', populate: 'job' });
    if (!interview) return res.status(404).json({ message: 'No interview scheduled' });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInterviewStatus = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    const interview = await InterviewSchedule.findOne({
      _id: req.params.interviewId,
      recruiter: recruiter._id
    });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    interview.status = req.body.status;
    await interview.save();
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { scheduleInterview, getInterviewsByRecruiter, getInterviewByApplication, updateInterviewStatus };
