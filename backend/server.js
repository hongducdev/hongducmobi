import express from "express";
import dotenv from "dotenv";

// routes
import authRoutes from "./routes/auth.route.js";

// connectDB
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDB();
});