const express = require('express');
const router = express.Router();
const { generateOffer, getOfferByApplication, respondToOffer } = require('../controllers/offerController');
const { protect, recruiterOnly, applicantOnly } = require('../middleware/auth');

router.post('/generate', protect, recruiterOnly, generateOffer);
router.get('/application/:applicationId', protect, getOfferByApplication);
router.patch('/:offerId/respond', protect, applicantOnly, respondToOffer);

module.exports = router;
