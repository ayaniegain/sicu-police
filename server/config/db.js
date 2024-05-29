const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://assistantsicuaura:RwTs27QJwVK7HSmA@sicu-aura.9n4n4vn.mongodb.net/Police-Website", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'Police-Website'
        });
        console.log('MongoDB connection successful');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); 
    }
};

module.exports = { connectDB };