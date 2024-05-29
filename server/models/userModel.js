// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    policeStationName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    city: { type: String, required: true },
    areaOfAction: { type: String, required: true },
    state: { type: String, required: true },
    officerPhoneNumber: { type: String, required: true },
    pincode: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String }
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
