import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// routes
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";

// connectDB
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(port, () => {
    console.log(`[SERVER]: Server running on port ${port}`);
    connectDB();
});