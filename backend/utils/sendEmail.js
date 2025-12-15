// backend/utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"DiasporaStay" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("📧 Email sent to:", to);
    } catch (err) {
        console.error("❌ Email error:", err);
    }
};
