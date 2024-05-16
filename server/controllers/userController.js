const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt.js');
const { getUsersObj } = require('../models/User.js');
const saltRounds = 10;

const signUp = async (req, res) => {
    try {

        
        const usersObj = getUsersObj();
        const {
            psname,
            email,
            address,
            phno,
            city,
            areaofaction,
            state,
            officerno,
            pincode,
            password,
        } = req.body;
        const existingUser = await usersObj.findOne({ $or: [{ psname }, { email }] });
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
        await usersObj.insertOne({
            psname,
            email,
            address,
            phno,
            city,
            areaofaction,
            state,
            officerno,
            pincode,
            password: hashedPassword,
            image: image,
        });

        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    try {
        const usersObj = getUsersObj();
        const {psname, email, password, spa } = req.body;
        const user = await usersObj.findOne({ email });
        if (user) {
            //console.log(user)
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ psname: user.psname, image: user.image}, jwtSecret, { expiresIn: '1h' });
                res.json({ token, status: 'ok' });
            } else {
                return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
            }
        } else {
            return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { signUp, login };
