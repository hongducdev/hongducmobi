import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["pending", "paid", "failed", "delivered", "cancelled"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["cod", "vnpay"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        transactionId: {
            type: String,
            unique: true,
            sparse: true,
        },
        vnpayResponse: {
            type: Object,
            default: null,
        },
        shippingAddress: {
            street: String,
            city: String,
            district: String,
            ward: String,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
