// models/User.js
const { MongoClient } = require("mongodb");
const DBurl = "mongodb+srv://gshvamsi:mongoDB@cluster0.lss5ymq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let usersObj;

const connectToDB = async () => {
    try {
        const client = await MongoClient.connect(DBurl, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db("police-station");
        usersObj = db.collection("users");


        console.log('User database connection success!');
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
};

module.exports = { connectToDB, getUsersObj: () => usersObj };

