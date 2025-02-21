import express from "express";
import { getOrders, createOrder, getAdminOrders, updateOrderStatus, getAdminOrderDetail, getUserOrderDetail } from "../controllers/order.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/', protect, getOrders);
router.post('/', protect, createOrder);
router.get('/admin', protect, admin, getAdminOrders);
router.patch('/:orderId/status', protect, admin, updateOrderStatus);
router.post("/create", protect, createOrder);
router.get('/admin/:id', protect, admin, getAdminOrderDetail);
router.get('/:id', protect, getUserOrderDetail);

export default router; 