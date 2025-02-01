import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
    try {
    } catch (error) {
        console.log(`[ERROR]: Error getting all products: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }

        featuredProducts = await Product.find({
            isFeatured: true,
            isDeleted: false,
        }).lean();
        if (!featuredProducts) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm nào",
            });
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.json(featuredProducts);
    } catch (error) {
        console.log(
            `[ERROR]: Error getting featured products: ${error.message}`
        );
        res.status(500).json({
            message: error.message,
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            price,
            images,
            category,
            quantity,
        } = req.body;

        console.log(req.body);
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res
                .status(400)
                .json({ message: "Cần ít nhất một hình ảnh" });
        }

        const uploadedImages = await Promise.all(
            images.map(async (image) => {
                try {
                    const result = await cloudinary.uploader.upload(image, {
                        folder: "Products",
                    });
                    return result.secure_url;
                } catch (error) {
                    console.error(
                        `[ERROR]: Error uploading image to Cloudinary: ${error.message}`
                    );
                    throw error;
                }
            })
        );

        const product = await Product.create({
            name,
            slug,
            description,
            price,
            images: uploadedImages,
            category,
            quantity,
            isFeatured,
        });

        res.status(200).json({
            message: "Sản phẩm được tạo thành công",
            product,
        });
    } catch (error) {
        console.log(`[ERROR]: Error creating product: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm nào",
            });
        }

        // change isDeleted to true
        product.isDeleted = true;
        await product.save();

        res.status(200).json({
            message: "Sản phẩm đã được xoá",
        });
    } catch (error) {
        console.log(`[ERROR]: Error deleting product: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 4 },
            },
            {
                $match: {
                    isDeleted: { $ne: true },
                },
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    images: 1,
                    price: 1,
                },
            },
        ]);

        res.json(products);
    } catch (error) {
        console.log(
            `[ERROR]: Error getting recommended products: ${error.message}`
        );
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({
            category,
            isDeleted: { $ne: true },
        });
        res.json(products);
    } catch (error) {
        console.log(
            `[ERROR]: Error getting products by category: ${error.message}`
        );
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateFeaturedProductsCache = async () => {
    try {
        const featuredProducts = await Product.find({
            isFeatured: true,
            isDeleted: false,
        }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log(
            `[ERROR]: Error updating featured products cache: ${error.message}`
        );
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm nào",
            });
        }
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();
        await updateFeaturedProductsCache();
        res.json(updatedProduct);
    } catch (error) {
        console.log(
            `[ERROR]: Error toggling featured product: ${error.message}`
        );
        res.status(500).json({
            message: error.message,
        });
    }
};
