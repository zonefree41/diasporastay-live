import jwt from "jsonwebtoken";
import Owner from "../models/Owner.js";

const protectOwner = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const owner = await Owner.findById(decoded.ownerId).select("-password");
        if (!owner) {
            return res.status(401).json({ message: "Owner not found" });
        }

        req.owner = owner; // ✅ REQUIRED
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default protectOwner;

