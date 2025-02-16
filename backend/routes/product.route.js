import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getProductById,
    getProductsByCategory,
    getRecommendedProducts,
    toggleFeaturedProduct,
    updateProduct,
} from "../controllers/product.controller.js";
import { admin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/create", protect, admin, createProduct);
router.patch("/:id", protect, admin, toggleFeaturedProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.put("/:id", protect, admin, updateProduct);
router.get("/:id", getProductById);

export default router;
