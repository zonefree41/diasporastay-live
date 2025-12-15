// routes/seedBookings.js
import express from "express";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// Generate random date
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

console.log("🔥 seedBookings.js LOADED");


// SEED BOOKINGS
router.get("/", async (req, res) => {
    try {
        await Booking.deleteMany({});

        const hotels = await Hotel.find();
        if (hotels.length === 0) {
            return res.status(400).json({ error: "No hotels found to seed bookings." });
        }

        const guestNames = [
            "John Doe", "Amanuel T", "Sofia G", "Michael B",
            "Sara A", "Lily K", "Daniel M", "Chris N",
            "Helen W", "Brooklyn P"
        ];

        let created = [];

        for (let hotel of hotels) {
            const count = Math.floor(Math.random() * 4) + 2;

            for (let i = 0; i < count; i++) {
                const checkIn = randomDate(
                    new Date(2025, 0, 1),
                    new Date(2025, 2, 1)
                );

                const nights = Math.floor(Math.random() * 5) + 1;
                const checkOut = new Date(checkIn);
                checkOut.setDate(checkOut.getDate() + nights);

                const totalPrice = nights * (hotel.price || hotel.pricePerNight || 100);

                const booking = await Booking.create({
                    hotel: hotel._id,
                    ownerId: hotel.ownerId,
                    guestName: guestNames[Math.floor(Math.random() * guestNames.length)],
                    guestEmail: `${Math.random().toString(36).substring(2, 7)}@zonefree41@gmail.com`, // ✅ NEW
                    checkIn: checkIn.toISOString().substring(0, 10),
                    checkOut: checkOut.toISOString().substring(0, 10),
                    nights,
                    totalPrice
                });


                created.push(booking);
            }
        }

        res.json({
            message: "🌟 Bookings seeded successfully!",
            count: created.length,
            bookings: created
        });

    } catch (error) {
        console.error("Seed booking error:", error);
        res.status(500).json({ error: "Failed to seed bookings" });
    }
});

export default router;
