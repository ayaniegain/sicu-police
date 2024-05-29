// models/registrationModel.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    dateTime: { type: Date, required: true },
    name: { type: String, required: true },
    photo: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    imeiNumber1: { type: String, required: true },
    imeiNumber2: { type: String, required: true },
    governmentID: { type: String, required: true },
    liveLocation: {type: String, required:true},
    victimType: { type: String, required: true },
    emergencyType: { type: String, required: true },
    status: { type: String, required: true }
}  );

const Registration = mongoose.model('Registration', registrationSchema, 'registrations');
module.exports = Registration;
