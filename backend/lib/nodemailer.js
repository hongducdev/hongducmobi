import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export const sendEmail = async (email, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email, 
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("[NODEMAILER]: Email đã được gửi:", info.messageId);
    } catch (error) {
        console.error("[NODEMAILER]: Lỗi khi gửi email:", error);
        throw new Error("Không thể gửi email");
    }
};
