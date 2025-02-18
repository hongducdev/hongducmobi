import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getProductById,
    getProductBySlug,
    getProductsByCategory,
    getRecommendedProducts,
    toggleFeaturedProduct,
    updateProduct,
    getCategories,
} from "../controllers/product.controller.js";
import { admin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Đặt các route tĩnh lên trước
router.get("/categories", getCategories);
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);

// Route với pattern cụ thể
router.get("/category/:category", getProductsByCategory);
router.get("/id/:id", getProductById);

// Route với params
router.post("/create", protect, admin, createProduct);
router.patch("/:id", protect, admin, toggleFeaturedProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.put("/:id", protect, admin, updateProduct);

// Route với slug đặt sau các route khác
router.get("/:slug", getProductBySlug);

// Route mặc định đặt cuối cùng
router.get("/", getAllProducts);

export default router;
