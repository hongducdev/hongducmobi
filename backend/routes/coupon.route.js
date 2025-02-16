import express from "express";
import { admin, protect } from "../middleware/auth.middleware.js";
import {
    createCoupon,
    deleteCoupon,
    getCoupon,
    getCoupons,
    updateCoupon,
    validateCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protect, getCoupons);
router.get("/:id", protect, getCoupon);
router.post("/", protect, admin, createCoupon);
router.get("/validate", protect, validateCoupon);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

export default router;
