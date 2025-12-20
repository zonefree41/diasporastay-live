import jwt from "jsonwebtoken";
import Owner from "../models/Owner.js";

export const protectOwner = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const owner = await Owner.findById(decoded.ownerId).select("-password");

    if (!owner) {
      return res.status(401).json({ message: "Owner not found" });
    }

    req.owner = owner;
    next();
  } catch (error) {
    console.error("protectOwner error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
