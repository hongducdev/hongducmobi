import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";

// routes
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import userRoutes from "./routes/user.route.js";
import paymentRoutes from "./routes/payment.route.js";
import orderRoutes from "./routes/order.route.js";

// connectDB
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 giờ
    }
}));

app.use(express.json({
    limit: "50mb"
}));
app.use(express.urlencoded({limit: "50mb", extended: true }));
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
app.use("/api/coupons", couponRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

app.listen(port, () => {
    console.log(`[SERVER]: Server running on port ${port}`);
    connectDB();
});