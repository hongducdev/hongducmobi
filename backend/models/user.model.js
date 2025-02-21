import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên người dùng là bắt buộc"],
        },
        email: {
            type: String,
            required: [true, "Email là bắt buộc"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: false,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Mật khẩu là bắt buộc"],
            minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
        },
        role: {
            type: String,
            required: [true, "Vai trò là bắt buộc"],
            default: "USER",
            enum: ["USER", "ADMIN"],
        },
        token: {
            type: String,
            default: "",
        },
        tokenExp: {
            type: Number,
            default: 0,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }],
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        tokens: {
            accessToken: {
                type: String,
                default: null,
            },
            refreshToken: {
                type: String,
                default: null,
            },
            refreshTokenExp: {
                type: Date,
                default: null,
            },
        },
        address: {
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

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    this.token = token;
    this.tokenExp = Date.now() + 30 * 60 * 1000;
    await this.save();

    return token;
};

userSchema.methods.verifyToken = async function (token) {
    if (this.tokenExp < Date.now()) {
        throw new Error("Token đã hết hạn");
    }

    const isMatch = (await token) === this.token;
    if (!isMatch) {
        return false;
    }

    this.isVerified = true;
    this.token = "";
    this.tokenExp = 0;
    await this.save();

    return true;
};

const User = mongoose.model("User", userSchema);

export default User;
