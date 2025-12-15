import Guest from "../models/Guest.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const guestRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await Guest.findOne({ email });
        if (exists) return res.status(400).json({ error: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const guest = await Guest.create({ name, email, password: hashed });

        res.json({ message: "Guest registered", guest });
    } catch (err) {
        console.error("Guest register error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

export const guestLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const guest = await Guest.findOne({ email });
        if (!guest) return res.status(400).json({ error: "Invalid email or password" });

        const match = await bcrypt.compare(password, guest.password);
        if (!match) return res.status(400).json({ error: "Invalid email or password" });

        const token = jwt.sign(
            { guestId: guest._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, guest });

    } catch (err) {
        console.error("Guest login error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
