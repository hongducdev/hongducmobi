import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        startDate: {
            type: Date,
            required: true,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        maxUses: {
            type: Number,
            required: true,
        },
        currentUses: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        usedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
