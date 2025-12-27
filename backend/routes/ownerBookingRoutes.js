// backend/routes/ownerBookingRoutes.js
import express from "express";
import Booking from "../models/Booking.js";
import { ownerAuth } from "../middleware/ownerAuth.js";
import protectOwner from "../middleware/protectOwner.js";
import Hotel from "../models/Hotel.js";


const router = express.Router();

/*
   OWNER BOOKINGS API

   GET /api/owner/bookings
   → All bookings for this owner

   GET /api/owner/bookings/hotel/:hotelId
   → Bookings for a specific hotel
*/

/* ======================================================
   OWNER: GET MY BOOKINGS
====================================================== */
router.get("/bookings", protectOwner, async (req, res) => {
    try {
        // 1️⃣ Find hotels owned by this owner
        const hotels = await Hotel.find(
            { ownerId: req.owner._id },
            "_id name"
        );

        const hotelIds = hotels.map(h => h._id);

        if (!hotelIds.length) {
            return res.json([]);
        }

        // 2️⃣ Find bookings for those hotels
        const bookings = await Booking.find({
            hotel: { $in: hotelIds },
        })
            .sort({ createdAt: -1 })
            .populate("hotel", "name city country images")
            .populate("guestId", "name email");

        res.json(bookings);
    } catch (err) {
        console.error("OWNER BOOKINGS ERROR:", err);
        res.status(500).json({ message: "Failed to load owner bookings" });
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
