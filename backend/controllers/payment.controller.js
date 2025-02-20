import querystring from "qs";
import crypto from "crypto";
import { vnpayConfig } from "../config/vnpay.js";
import Order from "../models/order.model.js";
import moment from "moment";

export const createPaymentUrl = async (req, res) => {
    try {
        const { amount, items, discount, paymentMethod } = req.body;

        // Set múi giờ
        process.env.TZ = "Asia/Ho_Chi_Minh";

        let date = new Date();
        let createDate = moment(date).format("YYYYMMDDHHmmss");
        let orderId = moment(date).format("DDHHmmss");

        // Tạo order trước
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
            transactionId: orderId, // Lưu orderId làm transactionId
        });

        let ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

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
            const rspCode = vnp_Params["vnp_ResponseCode"];

            if (rspCode === "00") {
                await Order.findOneAndUpdate(
                    { transactionId },
                    {
                        status: "paid",
                        paymentStatus: "completed",
                        vnpayResponse: vnp_Params,
                    }
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
