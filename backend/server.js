import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

// connectDB
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(port, () => {
    console.log(`[SERVER]: Server running on port ${port}`);
    connectDB();
});