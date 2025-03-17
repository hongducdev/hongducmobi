import { sendEmail } from "../lib/nodemailer.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateTokens = async (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d",
        }
    );

    return { accessToken, refreshToken };
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExits = await User.findOne({ email });
        if (userExits) {
            res.status(400).json({
                message: "Nguời dùng đã tồn tại!",
            });
        } else {
            const user = await User.create({ name, email, password });
            if (user) {
                const token = await user.generateToken();
                await sendEmail(
                    email,
                    "Xác minh tài khoản",
                    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
                    <div style="text-align: center; padding: 20px;">
                        <h1 style="color: #333; margin-bottom: 20px;">Xác minh tài khoản của bạn</h1>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác minh dưới đây:</p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 2px dashed #4CAF50;">
                            <span style="font-size: 24px; font-weight: bold; color: #4CAF50; letter-spacing: 3px;">${token}</span>
                        </div>
                        <p style="color: #ff6b6b; font-size: 14px; margin-top: 20px;">
                            ⏰ Lưu ý: Mã xác minh này chỉ có hiệu lực trong vòng 15 phút.
                        </p>
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">
                            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
                        </p>
                    </div>
                </div>`
                );

                res.status(200).json({
                    message: "Vui lòng kiểm tra email để xác minh tài khoản!",
                });
            } else {
                res.status(500).json({
                    message: "Đăng ký tài khoản thất bại",
                });
            }
        }
    } catch (error) {
        console.log(`[ERROR]: Error registering user: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const verifyToken = async (req, res) => {
    const { token, email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Email không hợp lệ",
            });
        }

        const userVerified = await user.verifyToken(token);
        if (!userVerified) {
            return res.status(400).json({
                message: "Mã xác minh không hợp lệ",
            });
        }

        res.status(200).json({
            message: "Xác minh thành công",
        });
    } catch (error) {
        console.log(`[ERROR]: Error verifying token: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const resendToken = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Email không hợp lệ",
            });
        }

        const token = await user.generateToken();
        await sendEmail(
            email,
            "Xác minh tài khoản",
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
                    <div style="text-align: center; padding: 20px;">
                        <h1 style="color: #333; margin-bottom: 20px;">Xác minh tài khoản của bạn</h1>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác minh dưới đây:</p>
                        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 2px dashed #4CAF50;">
                            <span style="font-size: 24px; font-weight: bold; color: #4CAF50; letter-spacing: 3px;">${token}</span>
                        </div>
                        <p style="color: #ff6b6b; font-size: 14px; margin-top: 20px;">
                            ⏰ Lưu ý: Mã xác minh này chỉ có hiệu lực trong vòng 15 phút.
                        </p>
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">
                            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
                        </p>
                    </div>
                </div>`
        );
        res.status(200).json({
            message: "Vui lòng kiểm tra email để xác minh tài khoản!",
        });
    } catch (error) {
        console.log(`[ERROR]: Error resending token: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

const storeTokens = async (userId, accessToken, refreshToken) => {
    await User.findByIdAndUpdate(userId, {
        tokens: {
            accessToken,
            refreshToken,
            refreshTokenExp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 60 * 60 * 24 * 1000,
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng!",
            });
        } else {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Mật khẩu không đúng!",
                });
            }
            if (!user.isVerified) {
                return res.status(400).json({
                    message: "Vui lòng xác minh tài khoản!",
                });
            }

            const { refreshToken, accessToken } = await generateTokens(
                user._id
            );
            await storeTokens(user._id, accessToken, refreshToken);

            setCookies(res, accessToken, refreshToken);

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            });
        }
    } catch (error) {
        console.log(`[ERROR]: Error logging in user: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );
            await User.findByIdAndUpdate(decoded.userId, {
                tokens: {
                    accessToken: null,
                    refreshToken: null,
                    refreshTokenExp: null,
                },
            });
        }
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.status(200).json({
            message: "Đã đăng xuất thành công!",
        });
    } catch (error) {
        console.log(`[ERROR]: Error logging out user: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Vui lòng đăng nhập lại!",
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded.userId);
        if (
            !user ||
            user.tokens.refreshToken !== refreshToken ||
            user.tokens.refreshTokenExp < new Date()
        ) {
            return res.status(401).json({
                message: "Vui lòng đăng nhập lại!",
            });
        }

        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            }
        );

        await User.findByIdAndUpdate(decoded.userId, {
            "tokens.accessToken": accessToken,
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.json({
            message: "Đã tạo mới accessToken thành công!",
        });
    } catch (error) {
        console.log(`[ERROR]: Error refreshing token: ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            address: req.user.address,
            phoneNumber: req.user.phoneNumber,
            isVerified: req.user.isVerified,
        };
        res.json(user);
    } catch (error) {
        console.log(`[ERROR]: Error getting profile: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const sendTokenForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email không tìm thấy" });
        }

        const resetToken = await user.generateToken();
        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

        await sendEmail(
            email,
            "Khôi phục mật khẩu",
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
                    <div style="text-align: center; padding: 20px;">
                        <h1 style="color: #333; margin-bottom: 20px;">Đặt lại mật khẩu</h1>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">Bạn nhận được email này vì chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                        <a href="${resetUrl}" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin-top: 20px;">Đặt lại mật khẩu</a>
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">
                            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                        </p>
                    </div>
                </div>`
        );

        res.json({ message: "Vui lòng kiểm tra email để khôi phục mật khẩu" });
    } catch (error) {
        console.log(`[ERROR]: Error forgot password: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "Token không hợp lệ" });
        }

        if (user.tokenExp < Date.now()) {
            return res.status(400).json({ message: "Token đã hết hạn" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.token = "";
        user.tokenExp = 0;
        await user.save();

        res.status(200).json({
            message: "Mật khẩu đã được cập nhật thành công",
        });

        await sendEmail(
            user.email,
            "Mật khẩu đã được cập nhật thành công",
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
                    <div style="text-align: center; padding: 20px;">
                        <h1 style="color: #333; margin-bottom: 20px;">Đổi mật khẩu thành công</h1>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">Mật khẩu của bạn đã được cập nhật thành công.</p>
                    </div>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                    Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ với chúng tôi.
                </p>
            </div>
            `
        );
    } catch (error) {
        console.error(`[ERROR]: Error resetting password: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng",
            });
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Mật khẩu hiện tại không đúng",
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            message: "Đổi mật khẩu thành công",
        });


        await sendEmail(
            user.email,
            "Mật khẩu đã được cập nhật thành công",
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
                    <div style="text-align: center; padding: 20px;">
                        <h1 style="color: #333; margin-bottom: 20px;">Đổi mật khẩu thành công</h1>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">Mật khẩu của bạn đã được cập nhật thành công.</p>
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">
                            Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ với chúng tôi.
                        </p>
                    </div>
                </div>
            `
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
