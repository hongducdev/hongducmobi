import express from "express";
import { protect, admin } from "../middleware/auth.middleware.js";
import { getUsers, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protect, admin, getUsers);
router.put("/profile", protect, updateProfile);

export default router;
