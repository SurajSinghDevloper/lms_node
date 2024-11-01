// src/config/database.js
import mongoose from 'mongoose';
import { logger } from './logger.js';
import dotenv from 'dotenv';
dotenv.config();

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

export default connectDB;
