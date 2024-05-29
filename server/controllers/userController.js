const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const axios = require('axios');
const saltRounds = 10;

const signUp = async (req, res) => {
    try {
        const {
            policeStationName,
            email,
            address,
            phoneNumber,
            city,
            areaOfAction,
            state,
            officerPhoneNumber,
            pincode,
            password,
        } = req.body;

        const existingUser = await User.findOne({ $or: [{ policeStationName }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Police Station Name or Email already exists' });
        }

        let image = null;
        if (req.file) {
            const imgurResponse = await axios.post('https://api.imgur.com/3/image', {
                image: req.file.buffer.toString('base64'),
            }, {
                headers: {
                    Authorization: 'Client-ID 3a7b91e97407cf6',
                    'Content-Type': 'application/json',
                },
            });
            image = imgurResponse.data.data.link;
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            policeStationName,
            email,
            address,
            phoneNumber,
            city,
            areaOfAction,
            state,
            officerPhoneNumber,
            pincode,
            password: hashedPassword,
            image: image,
        });

        await newUser.save();
        res.json({ status: 'ok' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ status: 'error', message: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ policeStationName: user.policeStationName, image: user.image }, "jwt-key", { expiresIn: '1h' });
                res.json({ token, status: 'ok' });
            } else {
                return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
            }
        } else {
            return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { signUp, login };
