// backend/middleware/protectGuest.js
import jwt from "jsonwebtoken";
import Guest from "../models/Guest.js";

const protectGuest = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;

        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const token = auth.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const guest = await Guest.findById(decoded.guestId).select("-password");

        if (!guest) {
            return res.status(401).json({ message: "Guest not found" });
        }

        req.guest = guest;
        next();
    } catch (err) {
        console.error("PROTECT GUEST ERROR:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default protectGuest;
