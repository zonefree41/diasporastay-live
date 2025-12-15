// middleware/adminAuth.js

export function adminAuth(req, res, next) {
    const adminKey = req.headers["x-admin-key"];

    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }

    next();
}
