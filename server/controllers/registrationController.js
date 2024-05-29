const Registration = require('../models/registrationModel');
const ObjectId = require('mongodb').ObjectId;

const updateStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        const updatedRegistration = await Registration.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            { status },
            { new: true } 
        );

        if (updatedRegistration) {
            res.json({ status: 'ok', updatedRegistration });
        } else {
            res.status(404).json({ status: 'error', message: 'Registration not found' });
        }
    } catch (err) {
        console.error('Update status error:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

const fetchRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({});
        res.json(registrations);
    } catch (err) {
        console.error('Fetch registrations error:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch registrations' });
    }
};

module.exports = { updateStatus, fetchRegistrations };

