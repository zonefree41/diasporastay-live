// backend/routes/ownerBookingRoutes.js
import express from "express";
import Booking from "../models/Booking.js";
import { ownerAuth } from "../middleware/ownerAuth.js";
import protectOwner from "../middleware/protectOwner.js";


const router = express.Router();

/*
   OWNER BOOKINGS API

   GET /api/owner/bookings
   → All bookings for this owner

   GET /api/owner/bookings/hotel/:hotelId
   → Bookings for a specific hotel
*/

// 🔹 Get ALL bookings for this owner
router.get("/bookings", protectOwner, async (req, res) => {
    try {
        // 1️⃣ Find owner's hotels
        const hotels = await Hotel.find({ owner: req.owner._id }).select("_id");

        const hotelIds = hotels.map(h => h._id);

        // 2️⃣ Find bookings for those hotels
        const bookings = await Booking.find({
            hotel: { $in: hotelIds }
        })
            .populate("guestId", "email name")
            .populate("hotel", "name city")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        console.error("OWNER BOOKINGS ERROR:", err);
        res.status(500).json({ message: "Failed to load bookings" });
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
