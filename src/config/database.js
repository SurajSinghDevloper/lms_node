// src/config/database.js
const mongoose = require('mongoose');
const { logger } = require('./logger');
require('dotenv').config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error("MongoDB URI is not defined in the environment variables.");
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true
        });

        logger.info('MongoDB 🔁🔁🔁 connected successfully');
    } catch (err) {
        logger.error(`MongoDB connection error: ${err.message}`);
        process.exit(1); // Exit the process with failure code
    }
};

module.exports = connectDB;
