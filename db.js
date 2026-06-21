const mongoose = require("mongoose")

async function connectDB(){
    const uri = process.env.MONGO_URI;
    if(!uri) throw new Error("Mongo Uri not set")
    await mongoose.connect(uri);
    console.log("MongoDB connected")
}

module.exports = connectDB