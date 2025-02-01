import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "Vui lòng đăng nhập lại!",
            });
        }

        try {
            const decoded = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );
            const user = await User.findById(decoded.userId).select(
                "-password"
            );

            if (!user) {
                return res.status(401).json({
                    message: "Vui lòng đăng nhập lại!",
                });
            }

            req.user = user;
            next();
        } catch (error) {
            if(error.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "Lưu ý: Mã xác minh này chỉ có hiệu lực trong vòng 15 phút.",
                });
            }
            throw error;
        }
    } catch (error) {
        console.log(`[ERROR]: Error protecting route: ${error.message}`);
        res.status(401).json({
            message: error.message,
        });
    }
};

export const adminRoute = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Quyền truy cập bị từ chối - Chỉ cho admin!",
        });
    }
    next();
};