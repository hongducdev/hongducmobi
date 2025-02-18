import express from "express";
import {
    addToCart,
    getCartProducts,
    removeAllFromCart,
    removeFromCart,
    updateQuantity,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protect, getCartProducts);
router.post("/", protect, addToCart);
router.delete("/", protect, removeAllFromCart);
router.delete("/:id", protect, removeFromCart);
router.put("/:id", protect, updateQuantity);

export default router;
