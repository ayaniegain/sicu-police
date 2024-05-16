const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js');
const registrationRoutes = require('./routes/registrationsRoutes.js');
const { connectToDB } = require('./models/User.js');
const { connectToDB2 } = require('./models/Registration.js')

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

connectToDB();
connectToDB2();

app.use('/api/', userRoutes);
app.use('/api/', registrationRoutes);

PORT = 1338

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));