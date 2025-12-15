import jwt from "jsonwebtoken";
import Guest from "../models/Guest.js";
import { authGuest } from "../middleware/authGuest.js";


export const authGuest = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided.",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret123"
        );

        req.guestId = decoded.id;  // ✅ FIXED

        const guest = await Guest.findById(decoded.id).select("-password");
        if (!guest) {
            return res.status(404).json({
                success: false,
                message: "Guest not found.",
            });
        }

        req.guest = guest;

        next();
    } catch (err) {
        console.error("authGuest ERROR:", err);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};
