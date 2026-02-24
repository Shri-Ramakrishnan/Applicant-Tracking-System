const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllActiveJobs,
  getRecruiterJobs,
  getJobById,
  updateJobStatus
} = require('../controllers/jobController');

const { protect, recruiterOnly } = require('../middleware/auth');
const { body } = require('express-validator');

/*
  IMPORTANT CHANGE:
  protect is now added so req.user exists.
  If token not present, protect should allow next()
  (If your protect blocks, tell me and I’ll adjust.)
*/
router.get('/', protect, getAllActiveJobs);

router.get('/my-jobs', protect, recruiterOnly, getRecruiterJobs);
router.get('/:id', getJobById);

router.post(
  '/',
  protect,
  recruiterOnly,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('requirements').notEmpty().withMessage('Requirements are required'),
    body('location').notEmpty().withMessage('Location is required')
  ],
  createJob
);

router.patch('/:id/status', protect, recruiterOnly, updateJobStatus);

module.exports = router;