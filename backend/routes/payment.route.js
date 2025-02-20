import express from "express";
import {
    createPaymentUrl,
    vnpayReturn,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create_payment_url", protect, createPaymentUrl);
router.get("/vnpay_return", vnpayReturn);

export default router;
