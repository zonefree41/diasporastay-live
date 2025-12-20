// backend/middleware/protectGuest.js
import jwt from "jsonwebtoken";
import Guest from "../models/Guest.js";

export const protectGuest = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.guest = await Guest.findById(decoded.guestId).select("-password");

        if (!req.guest) {
            return res.status(401).json({ message: "Guest not found" });
        }

        next();
    } catch (err) {
        console.error("protectGuest error:", err);
        res.status(401).json({ message: "Token failed" });
    }
};
