import Coupon from "../models/coupon.model.js";

export const createCoupon = async (req, res) => {
    try {
        const existingCoupon = await Coupon.findOne({ code: req.body.code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Mã giảm giá đã tồn tại!" });
        }
        const { code, discountPercentage, startDate, expirationDate, maxUses } =
            req.body;
        const coupon = await Coupon.create({
            code,
            discountPercentage,
            startDate,
            expirationDate,
            maxUses,
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

export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({
            isActive: true,
            startDate: { $lte: new Date() },
            expirationDate: { $gte: new Date() },
        }).sort({ createdAt: -1 });

        res.json(coupons);
    } catch (error) {
        console.log(`[ERROR]: Error getting coupons: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({
            _id: req.params.id,
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
        if (!req.body || !req.body.code) {
            return res.status(400).json({
                message: "Vui lòng cung cấp mã giảm giá",
            });
        }

        const { code } = req.body;
        const userId = req.user._id;

        const coupon = await Coupon.findOne({
            code,
            isActive: true,
            startDate: { $lte: new Date() },
            expirationDate: { $gte: new Date() },
        });

        if (!coupon) {
            return res.status(404).json({
                message: "Mã giảm giá không tồn tại hoặc đã hết hạn",
            });
        }

        if (coupon.usedBy.includes(userId)) {
            return res.status(400).json({
                message: "Bạn đã sử dụng mã giảm giá này",
            });
        }

        if (coupon.currentUses >= coupon.maxUses) {
            return res.status(400).json({
                message: "Mã giảm giá đã hết lượt sử dụng",
            });
        }

        res.json({
            message: "Mã giảm giá hợp lệ",
            discountPercentage: coupon.discountPercentage,
            couponId: coupon._id,
        });
    } catch (error) {
        console.log(`[ERROR]: Error validating coupon: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, discountPercentage, startDate, expirationDate, maxUses } =
            req.body;
        const coupon = await Coupon.findByIdAndUpdate(id, {
            code,
            discountPercentage,
            startDate,
            expirationDate,
            maxUses,
        });

        res.json({
            message: "Cập nhật mã giảm giá thành công!",
            coupon,
        });
    } catch (error) {
        console.log(`[ERROR]: Error updating coupon: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await Coupon.findByIdAndDelete(id);

        res.json({
            message: "Xóa mã giảm giá thành công!",
        });
    } catch (error) {
        console.log(`[ERROR]: Error deleting coupon: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const markCouponAsUsed = async (couponId, userId) => {
    try {
        const coupon = await Coupon.findById(couponId);
        if (!coupon) return;

        coupon.usedBy.push(userId);
        coupon.currentUses += 1;
        await coupon.save();
    } catch (error) {
        console.log(`[ERROR]: Error marking coupon as used: ${error.message}`);
    }
};
