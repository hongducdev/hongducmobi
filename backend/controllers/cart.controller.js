import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "cartItems.product",
            match: { isDeleted: { $ne: true } },
        });

        const cartItems = user.cartItems
            .filter((item) => item.product)
            .map((item) => ({
                product: item.product,
                quantity: item.quantity,
            }));

        res.json(cartItems);
    } catch (error) {
        console.log(`[ERROR]: Error getting cart products: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        // Kiểm tra role của user
        if (req.user.role === "admin") {
            return res.status(403).json({
                message: "Admin không thể thêm sản phẩm vào giỏ hàng"
            });
        }

        const { productId } = req.body;
        const user = await User.findById(req.user._id);

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        const existingItemIndex = user.cartItems.findIndex(
            (item) => item.product?.toString() === productId
        );

        if (existingItemIndex > -1) {
            user.cartItems[existingItemIndex].quantity += 1;
        } else {
            user.cartItems.push({
                product: productId,
                quantity: 1,
            });
        }

        await user.save();
        res.status(200).json({ message: "Thêm vào giỏ hàng thành công" });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: error.message });
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(
                (item) => item.id !== productId
            );
        }

        await user.save();

        res.status(200).json(user.cartItems);
    } catch (error) {
        console.log(`[ERROR]: Error removing all from cart: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        
        user.cartItems = user.cartItems.filter(
            (item) => item.product?.toString() !== id
        );
        
        await user.save();

        const updatedCart = await User.findById(req.user._id).populate({
            path: "cartItems.product",
            match: { isDeleted: { $ne: true } },
        });

        res.status(200).json({
            message: "Đã xóa sản phẩm khỏi giỏ hàng",
            cartItems: updatedCart.cartItems
        });
    } catch (error) {
        console.log(`[ERROR]: Error removing from cart: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = await User.findById(req.user._id);

        const existingItemIndex = user.cartItems.findIndex(
            (item) => item.product?.toString() === productId
        );

        if (existingItemIndex > -1) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(
                    (item) => item.product?.toString() !== productId
                );
            } else {
                user.cartItems[existingItemIndex].quantity = quantity;
            }
            await user.save();
            return res
                .status(200)
                .json({ message: "Cập nhật số lượng thành công" });
        } else {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm trong giỏ hàng",
            });
        }
    } catch (error) {
        console.log(`[ERROR]: Error updating quantity: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};
