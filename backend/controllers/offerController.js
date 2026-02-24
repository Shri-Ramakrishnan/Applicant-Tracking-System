const Offer = require('../models/Offer');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Recruiter = require('../models/Recruiter');
const Applicant = require('../models/Applicant');
const { sendOfferEmail } = require('../services/emailService');

const generateOffer = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id });
    if (!recruiter) return res.status(404).json({ message: 'Recruiter profile not found' });

    const { applicationId, salary, joiningDate } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate({ path: 'applicant', populate: { path: 'user', select: 'name email' } });

    if (!application) return res.status(404).json({ message: 'Application not found' });

    const job = await Job.findOne({ _id: application.job._id, recruiter: recruiter._id });
    if (!job) return res.status(403).json({ message: 'Not authorized' });

    if (application.status !== 'Interview Scheduled') {
      return res.status(400).json({ message: 'Offer can only be generated after interview is scheduled' });
    }

    const existingOffer = await Offer.findOne({ application: applicationId });
    if (existingOffer) return res.status(400).json({ message: 'Offer already exists for this application' });

    const offer = await Offer.create({
      application: applicationId,
      salary,
      joiningDate,
      status: 'Pending'
    });

    application.status = 'Offered';
    await application.save();

    const applicantUser = application.applicant.user;
    sendOfferEmail(applicantUser.email, applicantUser.name, application.job.title, salary, joiningDate);

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOfferByApplication = async (req, res) => {
  try {
    const offer = await Offer.findOne({ application: req.params.applicationId })
      .populate({ path: 'application', populate: 'job' });
    if (!offer) return res.status(404).json({ message: 'No offer found' });
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToOffer = async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ user: req.user._id });
    const offer = await Offer.findById(req.params.offerId)
      .populate({ path: 'application', populate: { path: 'applicant' } });

    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    if (offer.application.applicant._id.toString() !== applicant._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    offer.status = status;
    await offer.save();
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateOffer, getOfferByApplication, respondToOffer };
