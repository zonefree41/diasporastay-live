import jwt from "jsonwebtoken";
import Owner from "../models/Owner.js";

export const ownerAuth = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header?.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret123"
        );

        const owner = await Owner.findById(decoded.ownerId).select("-password");
        if (!owner) {
            return res.status(401).json({ error: "Owner not found" });
        }

        req.owner = owner;
        next();

    } catch (err) {
        console.error("ownerAuth middleware error:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
