const Job = require('../models/Job');
const Recruiter = require('../models/Recruiter');
const Application = require('../models/Application');
const { validationResult } = require('express-validator');


// CREATE JOB
const createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    if (!recruiter)
      return res.status(404).json({ message: 'Recruiter profile not found' });

    const { title, description, requirements, location } = req.body;

    // Prevent accidental duplicate job posting
    const existingJob = await Job.findOne({
      recruiter: recruiter._id,
      title,
      location,
      status: 'active'
    });

    if (existingJob) {
      return res.status(400).json({
        message: 'An active job with same title & location already exists.'
      });
    }

    const job = await Job.create({
      recruiter: recruiter._id,
      title,
      description,
      requirements,
      location
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL ACTIVE JOBS (With applied filtering)
const getAllActiveJobs = async (req, res) => {
  try {
    let jobs = await Job.find({ status: 'active' })
      .populate({
        path: 'recruiter',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    // If applicant is logged in → hide applied jobs
    if (req.user && req.user.role === 'applicant') {
      const applications = await Application.find({
        applicant: req.user._id
      }).select('job');

      const appliedJobIds = applications.map(app =>
        app.job.toString()
      );

      jobs = jobs.filter(
        job => !appliedJobIds.includes(job._id.toString())
      );
    }

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET RECRUITER JOBS
const getRecruiterJobs = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    if (!recruiter)
      return res.status(404).json({ message: 'Recruiter profile not found' });

    const jobs = await Job.find({ recruiter: recruiter._id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET JOB BY ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'recruiter',
        populate: { path: 'user', select: 'name email' }
      });

    if (!job)
      return res.status(404).json({ message: 'Job not found' });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE JOB STATUS
const updateJobStatus = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    if (!recruiter)
      return res.status(404).json({ message: 'Recruiter not found' });

    const job = await Job.findOne({
      _id: req.params.id,
      recruiter: recruiter._id
    });

    if (!job)
      return res.status(404).json({ message: 'Job not found' });

    job.status = req.body.status;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createJob,
  getAllActiveJobs,
  getRecruiterJobs,
  getJobById,
  updateJobStatus
};