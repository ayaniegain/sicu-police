// models/User.js
const { MongoClient } = require("mongodb");
const DBurl = "mongodb+srv://gshvamsi:mongoDB@cluster0.lss5ymq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let registrationsObj;

const connectToDB2 = async () => {
    try {
        const client = await MongoClient.connect(DBurl, { useNewUrlParser: true, useUnifiedTopology: true });
        const db2 = client.db("police-registrations");
        registrationsObj = db2.collection("registrations");

        console.log('Registration database connection success!');
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
};

module.exports = { connectToDB2, getRegistrationsObj: () => registrationsObj };

