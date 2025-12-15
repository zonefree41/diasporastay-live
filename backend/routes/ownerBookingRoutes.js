// backend/routes/ownerBookingRoutes.js
import express from "express";
import Booking from "../models/Booking.js";
import { ownerAuth } from "../middleware/ownerAuth.js";

const router = express.Router();

/*
   OWNER BOOKINGS API

   GET /api/owner/bookings
   → All bookings for this owner

   GET /api/owner/bookings/hotel/:hotelId
   → Bookings for a specific hotel
*/

// 🔹 Get ALL bookings for this owner
router.get("/", ownerAuth, async (req, res) => {
    try {
        const ownerId = req.owner._id;

        const bookings = await Booking.find({ ownerId })
            .sort({ createdAt: -1 })
            .populate("hotelId", "name city country")
            .populate("guestId", "name email");

        return res.json(bookings);
    } catch (err) {
        console.error("Owner bookings list error:", err);
        return res.status(500).json({ error: "Failed to load bookings" });
    }
});

// 🔹 Get bookings for ONE hotel (by hotelId)
router.get("/hotel/:hotelId", ownerAuth, async (req, res) => {
    try {
        const ownerId = req.owner._id;
        const { hotelId } = req.params;

        const bookings = await Booking.find({ ownerId, hotelId })
            .sort({ createdAt: -1 })
            .populate("hotelId", "name city country")
            .populate("guestId", "name email");

        return res.json(bookings);
    } catch (err) {
        console.error("Owner hotel bookings error:", err);
        return res.status(500).json({ error: "Failed to load hotel bookings" });
    }
});

export default router;
