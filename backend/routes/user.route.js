import express from "express";
import { protect, admin } from "../middleware/auth.middleware.js";
import { getUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protect, admin, getUsers);

export default router;
