const express = require('express');
const router = express.Router();
const { scheduleInterview, getInterviewsByRecruiter, getInterviewByApplication, updateInterviewStatus } = require('../controllers/interviewController');
const { protect, recruiterOnly } = require('../middleware/auth');

router.post('/schedule', protect, recruiterOnly, scheduleInterview);
router.get('/my', protect, recruiterOnly, getInterviewsByRecruiter);
router.get('/application/:applicationId', protect, getInterviewByApplication);
router.patch('/:interviewId/status', protect, recruiterOnly, updateInterviewStatus);

module.exports = router;
