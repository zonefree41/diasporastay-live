// backend/routes/bookingRoutes.js
import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import { protectGuest } from "../middleware/protectGuest.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ======================================================
   CREATE BOOKING + STRIPE CHECKOUT
====================================================== */
router.post("/create-checkout", protectGuest, async (req, res) => {
    try {
        const { hotelId, checkIn, checkOut, nights, totalPrice } = req.body;

        if (!hotelId || !checkIn || !checkOut || !nights || !totalPrice) {
            return res.status(400).json({ error: "Missing required booking fields" });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ error: "Hotel not found" });

        const guestId = req.guest?._id?.toString();
        if (!guestId) return res.status(401).json({ error: "Not authorized" });

        // Create booking (pending)
        const booking = await Booking.create({
            guestId,
            hotel: hotelId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            nights,
            pricePerNight: Number(totalPrice) / Number(nights),
            totalPrice: Number(totalPrice),
            paymentStatus: "pending",
            status: "active",
            hotelSnapshot: {
                name: hotel.name,
                city: hotel.city,
                country: hotel.country,
                images: hotel.images || [],
                pricePerNight: hotel.pricePerNight,
                minNights: hotel.minNights || 1,
            },
        });

        const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

        console.log("✅ FRONTEND_URL USED BY STRIPE =", process.env.FRONTEND_URL);

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: hotel.name,
                        },
                        unit_amount: Math.round(totalPrice * 100),
                    },
                    quantity: 1,
                },
            ],

            success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
        });

        booking.stripeSessionId = session.id;
        await booking.save();

        return res.json({ url: session.url });
    } catch (err) {
        console.error("🔥 Booking checkout error:", err);
        return res.status(500).json({ error: "Failed to create checkout" });
    }
});

/* ======================================================
   GUEST: LIST MY BOOKINGS
   GET /api/bookings/my
====================================================== */
router.get("/my", protectGuest, async (req, res) => {
    try {
        const guestId = req.guest?._id;
        const bookings = await Booking.find({ guestId })
            .sort({ createdAt: -1 })
            .populate("hotel", "name city country images pricePerNight minNights");

        res.json(bookings);
    } catch (err) {
        console.error("MY BOOKINGS ERROR:", err);
        res.status(500).json({ message: "Failed to load bookings" });
    }
});

/* ======================================================
   GUEST: BOOKING DETAILS
   GET /api/bookings/:id
====================================================== */
router.get("/:id", protectGuest, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid booking id" });
        }

        const booking = await Booking.findOne({
            _id: id,
            guestId: req.guest._id,
        }).populate("hotel", "name city country images pricePerNight minNights");

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        res.json(booking);
    } catch (err) {
        console.error("BOOKING DETAILS ERROR:", err);
        res.status(500).json({ message: "Failed to load booking" });
    }
});

/* ======================================================
   GUEST: CANCEL BOOKING (no refund yet)
   POST /api/bookings/:id/cancel
   - Only future bookings allowed
   - Unblocks hotel blockedDates for that range
====================================================== */
router.post("/:id/cancel", protectGuest, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid booking id" });
        }

        const booking = await Booking.findOne({
            _id: id,
            guestId: req.guest._id,
        });

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Only allow cancel if checkIn is in the future
        const now = new Date();
        const checkIn = new Date(booking.checkIn);
        if (checkIn <= now) {
            return res.status(400).json({
                message: "You can only cancel bookings before check-in date.",
            });
        }

        // Mark cancelled
        booking.status = "CANCELLED";
        booking.paymentStatus = booking.paymentStatus === "PAID" ? "CANCELLED" : booking.paymentStatus;
        await booking.save();

        // Unblock dates
        const hotel = await Hotel.findById(booking.hotel);
        if (hotel) {
            const start = new Date(booking.checkIn);
            const end = new Date(booking.checkOut);

            // build date strings for each night
            const toRemove = [];
            for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
                const iso = new Date(d).toISOString().slice(0, 10);
                toRemove.push(iso);
            }

            const existing = (hotel.blockedDates || []).map((d) =>
                new Date(d).toISOString().slice(0, 10)
            );

            const filtered = existing.filter((day) => !toRemove.includes(day));

            hotel.blockedDates = filtered.map((day) => new Date(day + "T00:00:00.000Z"));
            await hotel.save();
        }

        return res.json({ success: true, booking });
    } catch (err) {
        console.error("CANCEL BOOKING ERROR:", err);
        res.status(500).json({ message: "Failed to cancel booking" });
    }
});

/* =========================================
   CANCEL BOOKING (GUEST)
   PUT /api/bookings/:id/cancel
========================================= */
router.put("/:id/cancel", protectGuest, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            guest: req.guest._id,
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status === "CANCELLED") {
            return res.status(400).json({ message: "Booking already cancelled" });
        }

        // 🔁 Mark booking cancelled
        booking.status = "CANCELLED";
        await booking.save();

        // 🔓 UNBLOCK HOTEL DATES
        const hotel = await Hotel.findById(booking.hotel);
        if (hotel) {
            const start = new Date(booking.checkIn);
            const end = new Date(booking.checkOut);

            const datesToRemove = [];
            for (
                let d = new Date(start);
                d < end;
                d.setDate(d.getDate() + 1)
            ) {
                datesToRemove.push(d.toISOString().slice(0, 10));
            }

            hotel.blockedDates = (hotel.blockedDates || []).filter((d) => {
                return !datesToRemove.includes(
                    new Date(d).toISOString().slice(0, 10)
                );
            });

            await hotel.save();
        }

        res.json({ success: true, message: "Booking cancelled & dates unblocked" });
    } catch (err) {
        console.error("CANCEL BOOKING ERROR:", err);
        res.status(500).json({ message: "Failed to cancel booking" });
    }
});

/* ===========================
   GET SINGLE BOOKING (GUEST)
   GET /api/bookings/:id
=========================== */
router.get("/:id", protectGuest, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            guest: req.guest._id,
        }).populate("hotel");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);
    } catch (err) {
        console.error("BOOKING LOAD ERROR:", err);
        res.status(500).json({ message: "Failed to load booking" });
    }
});

/* ===========================
   CANCEL BOOKING + UNBLOCK
   PUT /api/bookings/:id/cancel
=========================== */
router.put("/:id/cancel", protectGuest, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            guest: req.guest._id,
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status === "CANCELLED") {
            return res.json({ success: true });
        }

        booking.status = "CANCELLED";
        await booking.save();

        // ✅ AUTO-UNBLOCK DATES
        const hotel = await Hotel.findById(booking.hotel);
        if (hotel) {
            const start = new Date(booking.checkIn);
            const end = new Date(booking.checkOut);

            const unblock = [];
            for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
                unblock.push(d.toISOString().slice(0, 10));
            }

            hotel.blockedDates = (hotel.blockedDates || []).filter(
                (d) => !unblock.includes(new Date(d).toISOString().slice(0, 10))
            );

            await hotel.save();
        }

        res.json({ success: true });
    } catch (err) {
        console.error("CANCEL BOOKING ERROR:", err);
        res.status(500).json({ message: "Cancel failed" });
    }
});

export default router;
