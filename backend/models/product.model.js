import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên sản phẩm là bắt buộc"],
        },
        slug: {
            type: String,
            required: [true, "Slug sản phẩm là bắt buộc"],
            unique: true,
        },
        description: {
            type: String,
            required: [true, "Mô tả sản phẩm là bắt buộc"],
        },
        price: {
            type: Number,
            min: 0,
            required: [true, "Giá sản phẩm là bắt buộc"],
        },
        images: {
            type: [String],
            required: [true, "Hình ảnh sản phẩm là bắt buộc"],
        },
        category: {
            type: String,
            required: [true, "Danh mục là bắt buộc"],
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
