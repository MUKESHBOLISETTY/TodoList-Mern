const mongoose = require("mongoose");
const config = require("./config.json");

module.exports = async () => {
    mongoose.connect(config.mongo_uri);
    return mongoose;
};

mongoose.connection.on('connected', () => {
    console.log("DATABASE HAS BEEN CONNECTED");
})