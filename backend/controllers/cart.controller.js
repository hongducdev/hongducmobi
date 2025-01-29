import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({
            _id: { $in: req.user.cartItems },
            isDeleted: { $ne: true },
        });

        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find(
                (cartItem) => cartItem.id === product._id
            );
            return { ...product.toJSON(), quantity: item.quantity };
        });

        res.json(cartItems);
    } catch (error) {
        console.log(`[ERROR]: Error getting cart products: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(
            (item) => item.id === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ id: productId, quantity: 1 });
        }

        await user.save();

        res.status(200).json(user.cartItems);
    } catch (error) {
        console.log(`[ERROR]: Error adding to cart: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
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

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(
            (item) => item.id === productId
        );

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(
                    (item) => item.id !== productId
                );
                await user.save();
                return res.status(200).json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            return res.status(200).json(user.cartItems);
        } else {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm nào",
            });
        }
    } catch (error) {}
};
