// backend/middleware/protectAdmin.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ DEFAULT IMPORT


export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Admin token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.userId;

    const user = await User.findById(userId).select("-password");

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    // Attach admin to request
    req.admin = user;
    req.adminId = user._id;

    next();
  } catch (err) {
    console.error("❌ protectAdmin error:", err.message);
    return res.status(401).json({
      message: "Invalid or expired admin token",
    });
  }
};
