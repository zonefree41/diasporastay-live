import crypto from "crypto";
import nodemailer from "nodemailer";
import Owner from "../models/Owner.js";

export const ownerForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const owner = await Owner.findOne({ email });
        if (!owner) return res.status(404).json({ error: "Email not found" });

        const token = crypto.randomBytes(32).toString("hex");
        owner.resetPasswordToken = token;
        owner.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
        await owner.save();

        const resetLink = `http://localhost:5173/owner/reset-password/${token}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({
            to: owner.email,
            from: process.env.EMAIL_FROM,
            subject: "DiasporaStay Password Reset",
            html: `<p>Click here to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
        });

        res.json({ message: "Reset link sent" });

    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ error: "Error sending email" });
    }
};
