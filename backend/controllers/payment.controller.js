import querystring from "qs";
import crypto from "crypto";
import { vnpayConfig } from "../config/vnpay.js";
import Order from "../models/order.model.js";
import moment from "moment";
import User from "../models/user.model.js";
import { sendEmail } from "../lib/nodemailer.js";
import { formatCurrency } from "../utils/format.js";
import Product from "../models/product.model.js";

export const createPaymentUrl = async (req, res) => {
    try {
        const { amount, items, discount, paymentMethod, shippingAddress } =
            req.body;

        process.env.TZ = "Asia/Ho_Chi_Minh";

        let date = new Date();
        let createDate = moment(date).format("YYYYMMDDHHmmss");
        let orderId = moment(date).format("DDHHmmss");

        const order = await Order.create({
            user: req.user._id,
            items: items.map((item) => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: amount,
            discount,
            paymentMethod,
            status: "pending",
            transactionId: orderId,
            shippingAddress: shippingAddress || {},
        });

        await User.findByIdAndUpdate(req.user._id, {
            $push: { orders: order._id },
        });

        let ipAddr = req.headers["x-forwarded-for"] || 
            req.connection.remoteAddress ||
            req.socket.remoteAddress;

        let tmnCode = process.env.VNP_TMN_CODE;
        let secretKey = process.env.VNP_HASH_SECRET;
        let vnpUrl = process.env.VNP_URL;
        let returnUrl = process.env.VNP_RETURN_URL;

        let locale = "vn";
        let currCode = "VND";

        let vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;

        let paymentUrl =
            vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });

        res.json({ url: paymentUrl });
    } catch (error) {
        console.error("Error creating payment URL:", error);
        res.status(500).json({
            message: "Không thể tạo URL thanh toán",
            error: error.message,
        });
    }
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            "+"
        );
    }
    return sorted;
}

export const vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;
        let secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        let secretKey = process.env.VNP_HASH_SECRET;
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            const transactionId = vnp_Params["vnp_TxnRef"];
            const responseCode = vnp_Params["vnp_ResponseCode"];

            if (responseCode === "00") {
                const order = await Order.findOneAndUpdate(
                    { transactionId },
                    {
                        status: "paid",
                        paymentStatus: "completed",
                        vnpayResponse: vnp_Params,
                    }
                ).populate("items.product");

                for (const item of order.items) {
                    await Product.findByIdAndUpdate(
                        item.product._id,
                        {
                            $inc: {
                                quantity: -item.quantity,
                                sold: +item.quantity
                            }
                        }
                    );
                }

                const user = await User.findById(order.user);

                const shippingAddress = order.shippingAddress || {};
                const fullAddress =
                    [
                        shippingAddress.street,
                        shippingAddress.ward,
                        shippingAddress.district,
                        shippingAddress.city,
                    ]
                        .filter(Boolean)
                        .join(", ") || "Chưa cập nhật địa chỉ";

                const itemsList = order.items
                    .map(
                        (item) => `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">
                            <img src="${item.product.images[0]}" alt="${
                            item.product.name
                        }" style="width: 64px; height: 64px; object-fit: cover; border-radius: 4px;">
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">
                            <h4 style="margin: 0; color: #333;">${
                                item.product.name
                            }</h4>
                            <p style="margin: 4px 0 0; color: #666;">Số lượng: ${
                                item.quantity
                            }</p>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                            ${formatCurrency(item.price * item.quantity)}
                        </td>
                    </tr>
                `
                    )
                    .join("");

                const orderId = order._id.toString().slice(-8);

                await sendEmail(
                    user.email,
                    "Đặt hàng thành công",
                    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                            <h1 style="color: #28a745; margin-bottom: 10px;">Đặt hàng thành công!</h1>
                            <p style="color: #666;">Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi</p>
                        </div>

                        <div style="margin-top: 30px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; margin-bottom: 20px;">Thông tin đơn hàng #${orderId}</h2>
                            
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background-color: #f8f9fa;">
                                        <th style="padding: 12px; text-align: left;">Sản phẩm</th>
                                        <th style="padding: 12px; text-align: left;">Chi tiết</th>
                                        <th style="padding: 12px; text-align: right;">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsList}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Tổng tiền:</td>
                                        <td style="padding: 12px; text-align: right; font-weight: bold; color: #28a745;">
                                            ${formatCurrency(order.totalAmount)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div style="margin-top: 30px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h3 style="color: #333; margin-bottom: 15px;">Thông tin giao hàng</h3>
                            <p style="margin: 5px 0; color: #666;">Người nhận: ${
                                user.name
                            }</p>
                            <p style="margin: 5px 0; color: #666;">Địa chỉ: ${fullAddress}</p>
                            <p style="margin: 5px 0; color: #666;">Số điện thoại: ${
                                user.phoneNumber || "Chưa cập nhật"
                            }</p>
                        </div>

                        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email hoặc hotline.</p>
                        </div>
                    </div>`
                );

                res.json({
                    code: "00",
                    message: "Thanh toán thành công",
                    orderId: transactionId,
                });
            } else {
                await Order.findOneAndUpdate(
                    { transactionId },
                    {
                        status: "failed",
                        paymentStatus: "failed",
                        vnpayResponse: vnp_Params,
                    }
                );

                res.json({
                    code: "97",
                    message: "Thanh toán thất bại",
                    orderId: transactionId,
                });
            }
        } else {
            res.status(400).json({
                code: "97",
                message: "Chữ ký không hợp lệ",
            });
        }
    } catch (error) {
        console.error("Error processing payment return:", error);
        res.status(500).json({
            code: "97",
            message: "Lỗi xử lý thanh toán",
        });
    }
};

export const createPayment = async (req, res) => {
    try {
        const { items, totalAmount } = req.body;

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            status: "pending",
        });

        const paymentUrl = await createVNPayUrl({
            amount: totalAmount,
            orderId: order._id.toString(),
        });

        res.json({
            url: paymentUrl,
            orderId: order._id,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
