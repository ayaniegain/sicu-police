const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer();
const axios = require('axios');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const DBurl = "mongodb+srv://gshvamsi:mongoDB@cluster0.lss5ymq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let usersObj;
let registrationsObj;
const saltRounds = 10;

MongoClient.connect(DBurl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        const db = client.db("police-station");
        usersObj = db.collection("users");

        const db2 = client.db("police-registrations");
        registrationsObj = db2.collection("registrations");

        console.log('Databases connection success!');
    })
    .catch(err => console.error('Error connecting to database:', err));

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const jwtSecret = "jwt-key";
let token = null;

const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    //console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next(); 
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

app.get('/api/user', verifyUser, (req, res) => {
    res.json({ user: req.user });
});

app.get('/api/', async (req, res) => {
    try {
        const registrations = await registrationsObj.find({}).toArray();
        res.json(registrations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch registrations' });
    }
});

app.post('/api/signup', upload.single('image'), async (req, res) => {
    try {
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
});

app.post('/api/login', async (req, res) => {
    try {
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
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

app.post('/api/update-status', async (req, res) => {
    try {
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
});

const PORT = process.env.PORT || 1338;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const cleanup = () => {
    console.log('Stopping server...');
    if (token) {
        // Perform cleanup tasks here (e.g., delete the token)
        token = null;
        console.log('Token deleted.');
    }
    process.exit();
};

process.on('SIGINT', cleanup);
