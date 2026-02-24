const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  shortlistCandidate,
  rejectCandidate,
  screenApplication
} = require('../controllers/applicationController');
const { protect, recruiterOnly, applicantOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/my', protect, applicantOnly, getMyApplications);
router.get('/job/:jobId', protect, recruiterOnly, getApplicationsByJob);

router.post('/apply/:jobId', protect, applicantOnly, upload.single('resume'), applyToJob);

router.patch('/:applicationId/shortlist', protect, recruiterOnly, shortlistCandidate);
router.patch('/:applicationId/reject', protect, recruiterOnly, rejectCandidate);
router.patch('/:applicationId/screen', protect, recruiterOnly, screenApplication);

module.exports = router;
