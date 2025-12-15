import Owner from "../models/Owner.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (ownerId) => {
    return jwt.sign(
        { ownerId },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "7d" }
    );
};

/* =========================
   REGISTER OWNER
========================= */
export const registerOwner = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await Owner.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Email already registered.",
            });
        }

        const owner = await Owner.create({ name, email, password });

        return res.status(201).json({
            success: true,
            message: "Registration successful!",
            owner: {
                id: owner._id,
                name: owner.name,
                email: owner.email,
            }
        });

    } catch (err) {
        console.error("REGISTER OWNER ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error creating account",
        });
    }
};


/* =========================
   LOGIN OWNER
========================= */
export const loginOwner = async (req, res) => {
    try {
        const { email, password } = req.body;

        const owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await owner.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(owner._id);

        return res.json({
            success: true,
            token,
            owner: {
                id: owner._id,
                name: owner.name,
                email: owner.email,
            }
        });

    } catch (err) {
        console.error("LOGIN OWNER ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};
