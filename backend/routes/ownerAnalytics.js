import express from "express";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import { ownerAuth } from "../middleware/ownerAuth.js";

const router = express.Router();

/*
  FRONTEND EXPECTS THIS SHAPE:
  {
    totalEarnings: number,
    totalBookings: number,
    upcomingBookings: number,
    monthly: { Jan: 500, Feb: 800 },
    perHotel: { "Hyatt Addis": 1000, "Ramada": 500 }
  }
*/

router.get("/summary", ownerAuth, async (req, res) => {
    try {
        const ownerId = req.owner._id;

        // 1️⃣ Hotels owned by this owner
        const hotels = await Hotel.find({ ownerId }).select("_id name");
        const hotelIds = hotels.map(h => h._id);

        // 2️⃣ Bookings for these hotels
        const bookings = await Booking.find({
            hotel: { $in: hotelIds }
        }).sort({ createdAt: -1 });

        // 3️⃣ Total bookings
        const totalBookings = bookings.length;

        // 4️⃣ Total earnings
        const totalEarnings = bookings.reduce(
            (sum, b) => sum + (b.amountPaid || 0),
            0
        );

        // 5️⃣ Upcoming bookings
        const now = new Date();
        const upcomingBookings = bookings.filter(
            b => new Date(b.checkInDate) > now
        ).length;

        // 6️⃣ Monthly earnings
        const monthly = {};
        bookings.forEach(b => {
            const month = new Date(b.checkInDate).toLocaleString("default", { month: "short" });
            monthly[month] = (monthly[month] || 0) + (b.amountPaid || 0);
        });

        // 7️⃣ Per-hotel revenue
        const perHotel = {};
        hotels.forEach(hotel => {
            const sum = bookings
                .filter(b => String(b.hotel) === String(hotel._id))
                .reduce((acc, b) => acc + (b.amountPaid || 0), 0);

            perHotel[hotel.name] = sum;
        });

        // 8️⃣ Send response
        return res.json({
            totalEarnings,
            totalBookings,
            upcomingBookings,
            monthly,
            perHotel,
        });

    } catch (err) {
        console.error("🔥 Owner analytics summary error:", err);
        return res.status(500).json({ error: "Analytics summary failed" });
    }
});

export default router;
