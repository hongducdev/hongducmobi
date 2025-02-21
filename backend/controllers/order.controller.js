import { markCouponAsUsed } from './coupon.controller.js';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

export const createOrder = async (req, res) => {
    try {
        const { amount, items, discount, paymentMethod, shippingAddress } = req.body;

        // Tạo đơn hàng
        const order = await Order.create({
            user: req.user._id,
            items: items.map((item) => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: amount,
            discount,
            paymentMethod,
            status: paymentMethod === "cod" ? "pending" : "paid",
            shippingAddress,
        });

        // Thêm order vào user
        await User.findByIdAndUpdate(req.user._id, {
            $push: { orders: order._id },
        });

        // Cập nhật số lượng và số lượng đã bán của sản phẩm
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        quantity: -item.quantity,
                        sold: +item.quantity
                    }
                }
            );
        }

        res.status(201).json({
            message: "Đặt hàng thành công",
            orderId: order._id
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'orders',
                populate: {
                    path: 'items.product',
                    select: 'name price images'
                },
                options: { sort: { createdAt: -1 } }
            });
            
        res.json(user.orders);
    } catch (error) {
        console.log(`[ERROR]: Error getting orders: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const getAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email phoneNumber')
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 });
            
        res.json(orders);
    } catch (error) {
        console.error("Error getting admin orders:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json(order);
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết đơn hàng cho admin
export const getAdminOrderDetail = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phoneNumber')
            .populate('items.product', 'name price');

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json(order);
    } catch (error) {
        console.error("Error getting order detail:", error);
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết đơn hàng cho user
export const getUserOrderDetail = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('items.product', 'name price');

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json(order);
    } catch (error) {
        console.error("Error getting order detail:", error);
        res.status(500).json({ message: error.message });
    }
}; 