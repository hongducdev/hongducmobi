import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -tokens");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true }
        ).select("-password");

        res.json({
            message: "Cập nhật thông tin thành công",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.address = req.body;
        await user.save();
        
        res.json({
            message: "Cập nhật địa chỉ thành công",
            address: user.address
        });
    } catch (error) {
        console.log(`[ERROR]: Error updating address: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};
