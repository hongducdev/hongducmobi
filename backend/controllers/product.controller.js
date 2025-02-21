import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { isDeleted: false };

        if (search) {
            query = {
                ...query,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const products = await Product.find(query);
        res.json(products);
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
        const { name, slug, description, price, images, category, quantity } =
            req.body;

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

export const updateProduct = async (req, res) => {
    try {
        const { name, slug, description, price, images, category, quantity } =
            req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }

        let uploadedImages = product.images;
        if (images && Array.isArray(images) && images.length > 0) {
            uploadedImages = await Promise.all(
                images.map(async (image) => {
                    if (image.startsWith("http")) {
                        return image;
                    }
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
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                slug,
                description,
                price,
                images: uploadedImages,
                category,
                quantity,
            },
            { new: true }
        );

        if (updatedProduct.isFeatured) {
            await updateFeaturedProductsCache();
        }

        res.json({
            message: "Cập nhật sản phẩm thành công",
            product: updatedProduct,
        });
    } catch (error) {
        console.log(`[ERROR]: Error updating product: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm nào",
            });
        }
        res.json(product);
    } catch (error) {
        console.log(`[ERROR]: Error getting product by id: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({
            slug: req.params.slug,
            isDeleted: false,
        });

        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        res.json(product);
    } catch (error) {
        console.log(`[ERROR]: Error getting product by slug: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            slug: req.params.slug,
            isDeleted: false,
        });

        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.json(product);
    } catch (error) {
        console.log(`[ERROR]: Error getting product: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        res.json(categories);
    } catch (error) {
        console.log(`[ERROR]: Error getting categories: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};
