const express = require('express');
const router = express.Router();
const { updateStatus } = require('../controllers/registrationController');
const { fetchRegistrations } = require('../controllers/registrationController');

router.post('/update-status', updateStatus);
router.get('/', fetchRegistrations)

module.exports = router;