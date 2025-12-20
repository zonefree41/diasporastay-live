// backend/utils/sendEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default async function sendEmail({ to, subject, html }) {
    await transporter.sendMail({
        from: `"DiasporaStay" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
}
