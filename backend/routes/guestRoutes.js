// backend/routes/guestRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Guest from "../models/Guest.js";

const router = express.Router();

/* ============================
      EMAIL TRANSPORTER
=============================== */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/* ============================
      GUEST REGISTER
=============================== */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const existing = await Guest.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        await Guest.create({
            name,
            email,
            password: hashed,
        });

        res.json({ message: "Guest registered successfully" });
    } catch (err) {
        console.error("Guest register error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


/* ============================
        GUEST LOGIN
=============================== */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const guest = await Guest.findOne({ email });
        if (!guest) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, guest.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { guestId: guest._id },
            process.env.JWT_SECRET || "dev_secret",
            { expiresIn: "7d" }
        );

        return res.json({
            message: "Login successful",
            token,
            guest: {
                _id: guest._id,
                email: guest.email,
                name: guest.name,
            }
        });

    } catch (err) {
        console.error("Guest login error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

/* ============================
    GUEST FORGOT PASSWORD
=============================== */
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const guest = await Guest.findOne({ email });
        if (!guest) {
            return res.status(404).json({ error: "Email not found" });
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(32).toString("hex");

        guest.resetPasswordToken = resetToken;
        guest.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
        await guest.save();

        const resetUrl = `http://localhost:5173/guest/reset-password/${resetToken}`;

        // Luxury Email Template
        const htmlTemplate = `
            <div style="background:#000;padding:40px;text-align:center;">
                <h1 style="color:#d4af37;font-size:28px;margin-bottom:10px;">DiasporaStay</h1>
                <p style="color:white;font-size:16px;">
                    You requested a password reset for your guest account.
                </p>

                <a href="${resetUrl}"
                   style="display:inline-block;margin-top:20px;padding:12px 22px;
                          background:#d4af37;color:black;font-weight:bold;
                          text-decoration:none;border-radius:6px;">
                    Reset Password
                </a>

                <p style="color:#aaa;margin-top:25px;font-size:12px;">
                    If you did not request this, you can safely ignore this email.
                </p>
            </div>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: guest.email,
            subject: "DiasporaStay — Guest Password Reset",
            html: htmlTemplate,
        });

        return res.json({ message: "Reset link sent to your email." });

    } catch (err) {
        console.error("Guest forgot password error:", err);
        res.status(500).json({ error: "Failed to send reset email" });
    }
});

/* ============================
    GUEST RESET PASSWORD
=============================== */
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const guest = await Guest.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // token not expired
        });

        if (!guest) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        const hashed = await bcrypt.hash(password, 10);

        guest.password = hashed;
        guest.resetPasswordToken = undefined;
        guest.resetPasswordExpires = undefined;

        await guest.save();

        return res.json({ message: "Password reset successfully." });

    } catch (err) {
        console.error("Guest reset password error:", err);
        res.status(500).json({ error: "Server error during reset." });
    }
});

export default router;
