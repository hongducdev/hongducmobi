import express from "express";
import { admin, protect } from "../middleware/auth.middleware.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protect, admin, getAnalytics);

export default router;