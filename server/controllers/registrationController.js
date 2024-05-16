const { getRegistrationsObj } = require('../models/Registration')
const ObjectId = require('mongodb').ObjectId;

const updateStatus = async (req, res) => {
    try {
        const registrationsObj = getRegistrationsObj();

        console.log("registrationsObj",registrationsObj)
        const { id, status } = req.body;
        const updatedRegistration = await registrationsObj.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { status } },
            { returnOriginal: false }
        );
        if (updatedRegistration.value) {
            res.json({ status: 'ok', updatedRegistration: updatedRegistration.value });
        } else {
            res.status(404).json({ status: 'error', message: 'Registration not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

const fetchRegistrations = async (req, res) => {
    try {
        const registrationsObj = getRegistrationsObj();
        const registrations = await registrationsObj.find({}).toArray();
        res.json(registrations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch registrations' });
    }
}

module.exports = { updateStatus, fetchRegistrations };
