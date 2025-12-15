import jwt from "jsonwebtoken";
import Owner from "../models/Owner.js";

export const protectOwner = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Owner token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("🔍 Decoded owner token:", decoded);

        // 🔥 SUPPORT BOTH TOKEN SHAPES
        const ownerId = decoded.ownerId || decoded.id;

        if (!ownerId) {
            return res.status(401).json({ message: "Invalid owner token payload" });
        }

        const owner = await Owner.findById(ownerId).select("-password");

        if (!owner) {
            return res.status(401).json({ message: "Owner not found" });
        }

        req.ownerId = owner._id;
        req.owner = owner;

        next();
    } catch (err) {
        console.error("❌ protectOwner error:", err.message);
        return res.status(401).json({ message: "Invalid owner token" });
    }
};
