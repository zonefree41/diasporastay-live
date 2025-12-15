// backend/routes/guestAuthRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import Guest from "../models/Guest.js";

const router = express.Router();

/* ======================
   GUEST LOGIN
====================== */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const guest = await Guest.findOne({ email });
        if (!guest) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await guest.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // ⭐ Token must use { guestId: ... }
        const token = jwt.sign(
            { guestId: guest._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            message: "Login successful",
            token,
            guest: {
                _id: guest._id,
                email: guest.email,
                name: guest.name,
            },
        });

    } catch (err) {
        console.error("Guest login error:", err);
        return res.status(500).json({ error: "Server error during login" });
    }
});

/* ======================
   MIDDLEWARE: PROTECT GUEST
====================== */
const protectGuest = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ⭐ FIX — guestId OR id fallback
        const guestId = decoded.guestId || decoded.id;

        if (!guestId) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        const guest = await Guest.findById(guestId).select("-password");
        if (!guest) {
            return res.status(401).json({ error: "Guest not found" });
        }

        req.guest = guest;
        next();
    } catch (err) {
        console.error("Guest auth error:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};


/* ======================
   GET LOGGED-IN GUEST
====================== */
router.get("/me", protectGuest, async (req, res) => {
    try {
        return res.json({
            guest: {
                _id: req.guest._id,
                name: req.guest.name,
                email: req.guest.email,
                phone: req.guest.phone,
                country: req.guest.country,
                avatarUrl: req.guest.avatarUrl,
                createdAt: req.guest.createdAt,
            },
            stats: {
                totalBookings: 0,
                lastStay: null,
                totalSpent: 0,
            }
        });
    } catch (err) {
        console.error("ME route error:", err);
        return res.status(500).json({ error: "Server error loading profile" });
    }
});

export default router;
