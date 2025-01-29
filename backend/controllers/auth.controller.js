import { sendEmail } from "../lib/nodemailer.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateTokens = async (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "30d",
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

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(
        `refresh_token:${userId}`,
        refreshToken,
        "EX",
        7 * 60 * 60 * 24
    );
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 60 * 60 * 24 * 1000,
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng!",
            });
        } else {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Mật khẩu không đúng!",
                });
            }
            // check user verified
            if (!user.isVerified) {
                return res.status(400).json({
                    message: "Vui lòng xác minh tài khoản!",
                });
            }

            // auth
            const { refreshToken, accessToken } = await generateTokens(user._id);
            await storeRefreshToken(user._id, refreshToken);

            setCookies(res, accessToken, refreshToken);

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
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
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.status(200).json({
            message: "Đã đăng xuất thành công!",
        })
    } catch (error) {
        console.log(`[ERROR]: Error logging out user: ${error.message}`);
        res.status(500).json({
            message: error.message,
        })
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            return res.status(401).json({
                message: "Vui lòng đăng nhập lại!",
            })
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if(!storedToken || storedToken !== refreshToken) {
            return res.status(401).json({
                message: "Vui lòng đăng nhập lại!",
            })
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        })

        res.json({
            messsage: "Đã tạo mới accessToken thành công!",
        })
    } catch (error) {
        console.log(`[ERROR]: Error refreshing token: ${error.message}`);
        res.status(500).json({
            message: error.message,
        })
    }
}