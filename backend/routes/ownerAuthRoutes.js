// backend/routes/ownerAuthRoutes.js
import express from "express";
import {
    registerOwner,
    loginOwner
} from "../controllers/ownerAuthController.js";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Owner from "../models/Owner.js";

const router = express.Router();

/* =========================
   REGISTER
========================= */
router.post("/register", registerOwner);

/* =========================
   LOGIN
========================= */
router.post("/login", loginOwner);

/* =========================
   FORGOT PASSWORD
========================= */
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(404).json({ error: "Email not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        owner.resetPasswordToken = resetToken;
        owner.resetPasswordExpires = Date.now() + 1000 * 60 * 30;
        await owner.save();

        const resetUrl = `${process.env.FRONTEND_URL}/owner/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: owner.email,
            subject: "DiasporaStay Owner — Password Reset",
            html: `
                <h2>Reset Your Password</h2>
                <p>Click below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
            `,
        });

        return res.json({ message: "Reset link sent to your email." });

    } catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ error: "Failed to send reset email" });
    }
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const owner = await Owner.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!owner) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // MODEL WILL HASH THIS AUTOMATICALLY
        owner.password = password;

        owner.resetPasswordToken = undefined;
        owner.resetPasswordExpires = undefined;

        await owner.save();

        return res.json({ message: "Password reset successful." });

    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({ error: "Server error resetting password" });
    }
});

export default router;
