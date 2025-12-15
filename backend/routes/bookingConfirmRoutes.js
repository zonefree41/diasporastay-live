// backend/routes/bookingConfirmRoutes.js
import express from "express";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET /api/bookings/:id/confirm
|--------------------------------------------------------------------------
| Called by frontend after Stripe success redirect.
| Returns booking details for success page.
|--------------------------------------------------------------------------
*/
router.get("/:id/confirm", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const hotel = await Hotel.findById(booking.hotel);

        return res.json({
            bookingId: booking._id,
            status: booking.paymentStatus,
            hotel: {
                name: hotel?.name,
                city: hotel?.city,
                country: hotel?.country,
                image: hotel?.images[0],
            },
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            totalPrice: booking.totalPrice,
        });

    } catch (err) {
        console.error("❌ Booking confirm error:", err);
        res.status(500).json({ error: "Failed to confirm booking" });
    }
});

export default router;
