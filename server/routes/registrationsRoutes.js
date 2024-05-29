const express = require('express');
const router = express.Router();
const { updateStatus } = require('../controllers/registrationController');
const { fetchRegistrations } = require('../controllers/registrationController');
const registrationError = require('../middlewares/registrationError');

router.post('/update-status',registrationError, updateStatus);
router.get('/', registrationError, fetchRegistrations)

module.exports = router;