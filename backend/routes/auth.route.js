import express from "express";
import {
    register,
    login,
    logout,
    verifyToken,
    resendToken,
    refreshToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyToken);
router.post("/resend", resendToken);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

export default router;
