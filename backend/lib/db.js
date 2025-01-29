import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[DATABASE]: Connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.log(`[DATABASE]: Error while connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};