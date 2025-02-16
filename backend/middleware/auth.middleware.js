import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ message: "Không có token" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Không tìm thấy user" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        next();
    } else {
        res.status(403).json({ message: "Không có quyền truy cập" });
    }
};