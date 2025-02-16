import Coupon from "../models/coupon.model.js";

export const createCoupon = async (req, res) => {
    try {
        const { code, discountPercentage, expirationDate } = req.body;
        const coupon = await Coupon.create({
            code,
            discountPercentage,
            expirationDate,
            userId: req.user._id,
        });

        res.status(201).json({
            message: "Tạo mã giảm giá thành công!",
            coupon,
        });
    } catch (error) {
        console.log(`[ERROR]: Error creating coupon: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({
            userId: req.user._id,
            isActive: true,
        });

        res.json(coupon || null);
    } catch (error) {
        console.log(`[ERROR]: Error getting coupon: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({
            code: code,
            userId: req.user._id,
            isActive: true,
        });

        if (!coupon) {
            return res.status(404).json({ message: "Không tìm thấy mã giảm giá!" });
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Mã giảm giá đã hết hạn!" });
        }

        res.json({
            message: "Mã giảm giá hợp lệ!",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        });
    } catch (error) {
        console.log(`[ERROR]: Error validating coupon: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};