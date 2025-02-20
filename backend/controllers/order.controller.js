import { markCouponAsUsed } from './coupon.controller.js';

export const createOrder = async (req, res) => {
    try {
        const { items, couponId, ...orderData } = req.body;
        const userId = req.user._id;

        // Tạo đơn hàng
        const order = await Order.create({
            ...orderData,
            userId,
            items,
            couponId
        });

        // Nếu có sử dụng mã giảm giá và đơn hàng tạo thành công
        if (couponId) {
            await markCouponAsUsed(couponId, userId);
        }

        res.status(201).json({
            message: "Đặt hàng thành công",
            order
        });
    } catch (error) {
        console.log(`[ERROR]: Error creating order: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}; 