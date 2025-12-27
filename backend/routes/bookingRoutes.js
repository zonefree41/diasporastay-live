// backend/routes/bookingRoutes.js
import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import protectGuest from "../middleware/protectGuest.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ======================================================
   CREATE STRIPE CHECKOUT + BOOKING (PENDING)
====================================================== */
router.post("/create-checkout", protectGuest, async (req, res) => {
    try {
        const { hotelId, checkIn, checkOut } = req.body;

        if (!hotelId || !checkIn || !checkOut) {
            return res.status(400).json({ message: "Missing booking data" });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const nights =
            (end.getTime() - start.getTime()) /
            (1000 * 60 * 60 * 24);

        if (nights <= 0) {
            return res.status(400).json({ message: "Invalid date range" });
        }

        if (hotel.minNights && nights < hotel.minNights) {
            return res.status(400).json({
                message: `Minimum stay is ${hotel.minNights} nights`,
            });
        }

        const totalPrice = nights * hotel.pricePerNight;

        // ✅ Create booking (pending payment)
        const booking = await Booking.create({
            guestId: req.guest._id,
            hotel: hotel._id,
            checkIn: start,
            checkOut: end,
            nights,
            pricePerNight: hotel.pricePerNight,
            totalPrice,
            status: "active",
            hotelSnapshot: {
                name: hotel.name,
                city: hotel.city,
                country: hotel.country,
                images: hotel.images || [],
            },
        });

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: hotel.name },
                        unit_amount: Math.round(totalPrice * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL}/my-bookings`,
            cancel_url: `${process.env.FRONTEND_URL}/hotels/${hotel._id}`,
        });

        booking.stripeSessionId = session.id;
        await booking.save();

        res.json({ url: session.url });
    } catch (err) {
        console.error("CHECKOUT ERROR:", err);
        res.status(500).json({ message: "Checkout failed" });
    }
});


/* ======================================================
   GUEST: MY BOOKINGS
====================================================== */
router.get("/my", protectGuest, async (req, res) => {
    const bookings = await Booking.find({ guestId: req.guest._id })
        .sort({ createdAt: -1 })
        .populate("hotel");

    res.json(bookings);
});

/* ======================================================
   GUEST: BOOKING DETAILS
====================================================== */
router.get("/:id", protectGuest, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findOne({
        _id: req.params.id,
        guestId: req.guest._id,
    }).populate("hotel");

    if (!booking) return res.status(404).json({ message: "Not found" });

    res.json(booking);
});

/* ======================================================
   GUEST: CANCEL + REFUND
====================================================== */
router.put("/:id/cancel", protectGuest, async (req, res) => {
    const booking = await Booking.findOne({
        _id: req.params.id,
        guestId: req.guest._id,
    });

    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
        return res.json({ success: true });
    }

    // Refund if paid
    if (booking.stripePaymentIntentId) {
        await stripe.refunds.create({
            payment_intent: booking.stripePaymentIntentId,
        });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, booking });
});

export default router;
