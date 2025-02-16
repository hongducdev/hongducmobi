import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protect, getCoupon);
router.get("/validate", protect, validateCoupon);

export default router;
