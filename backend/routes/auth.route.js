import express from "express";
import {
    register,
    login,
    logout,
    verifyToken,
    resendToken,
    refreshToken,
    getProfile,
    sendTokenForgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyToken);
router.post("/resend", resendToken);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", sendTokenForgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", protectRoute, getProfile);

export default router;
