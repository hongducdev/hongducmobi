import express from "express";
import {
    addToCart,
    getCartProducts,
    removeAllFromCart,
    updateQuantity,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protect, getCartProducts);
router.post("/", protect, addToCart);
router.delete("/", protect, removeAllFromCart);
router.put("/:id", protect, updateQuantity);

export default router;
