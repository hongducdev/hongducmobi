import express from "express";
import { protect, admin } from "../middleware/auth.middleware.js";
import { getUsers, updateProfile, updateAddress } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protect, admin, getUsers);
router.put("/profile", protect, updateProfile);
router.put("/address", protect, updateAddress);

export default router;
