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

router.get("/categories", getCategories);
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);

router.get("/category/:category", getProductsByCategory);
router.get("/id/:id", getProductById);

router.post("/create", protect, admin, createProduct);
router.patch("/:id", protect, admin, toggleFeaturedProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.put("/:id", protect, admin, updateProduct);

router.get("/:slug", getProductBySlug);

router.get("/", getAllProducts);

export default router;
