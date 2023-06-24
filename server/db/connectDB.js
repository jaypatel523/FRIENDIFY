const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const connectDB = (url) => {
    return mongoose.connect(url)
        .then(() => console.log("connected to db..."));
}

module.exports = connectDB;