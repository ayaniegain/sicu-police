const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer();
const axios = require('axios');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { MongoClient, ObjectId } = require("mongodb");
const DBurl = "mongodb+srv://gshvamsi:mongoDB@cluster0.lss5ymq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const DBurl = "mongodb+srv://ayaniegain:ayanayan@cluster0.gonsuuk.mongodb.net/"
let usersObj;
const saltRounds = 10;

MongoClient.connect(DBurl, { useUnifiedTopology: true })
.then(async (client) => {
    const db = client.db("police-station");
    usersObj = db.collection("users");

    const changeStream = usersObj.watch();

    changeStream.on("change", async (change) => {
      console.log("Change occurred in users collection:", change);
      // Update usersObj when a change occurs
      usersObj = db.collection("users");
      console.log("create a new user", usersObj);
    });

    // Continue with your other database setup and application logic
    const db2 = client.db("police-registrations");
    registrationsObj = db2.collection("registrations");
    console.log("Databases connection success!");
  })
  .catch((err) => console.error("Error connecting to database:", err));

app.use(cors({
    // origin: ["http://localhost:3000"],
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie:{
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

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
    }else{
        return res.json({message:'error'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Failed to register user' });
  }
});

app.post('/api/login', async (req, res) => {
    try {
        const { psname, email, password, spa } = req.body;
        const user = await usersObj.findOne({ email });
        //req.session.psname = user.psname;
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                //console.log(req.session.psname);
                return res.json({ status: 'ok'}); 
            } else {
                return res.json({ status: 'error', message: 'Invalid email or password' });
            }
        } else {
            return res.json({ status: 'error', message: 'Invalid email or password' });
        }
    
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

app.get('/api/', async (req, res) => {
    /*console.log(req.session.psname)
    if(req.session.psname){
        return res.json({valid: true, psname: req.session.psname, image: req.session.image})
    }else{
        return res.json({valid: false})
    }*/
    try {
        const registrations = await registrationsObj.find({}).toArray();
        res.json(registrations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch registrations' });
    }

})

app.post('/api/update-status/', async (req, res) => {
    try {
        const { id, status } = req.body;
        const updatedRegistration = await registrationsObj.findOneAndUpdate(
            { _id: new ObjectId(id.toString()) }, // Convert id to string before passing to ObjectId constructor
            { $set: { status } },
            { returnOriginal: false }
        );
        console.log(updatedRegistration);
        if (updatedRegistration) {
            res.json({ status: 'ok', updatedRegistration });
        } else {
            res.status(404).json({ status: 'error', message: 'Registration not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
