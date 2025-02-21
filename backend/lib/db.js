import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`[DATABASE]: Connected to MongoDB`);
        return conn;
    } catch (error) {
        console.error(`[ERROR]: ${error.message}`);
        process.exit(1);
    }
};
