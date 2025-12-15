import jwt from "jsonwebtoken";
import Owner from "../models/Owner.js";


export const verifyOwnerToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret123"
        );

        req.ownerId = decoded.id;

        const owner = await Owner.findById(decoded.id).select("-password");
        if (!owner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found.",
            });
        }

        req.owner = owner;

        next();

    } catch (err) {
        console.error("AUTH ERROR:", err);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};
