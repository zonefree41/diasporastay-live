// backend/routes/ownerRefundRoutes.js
import express from "express";
import Stripe from "stripe";
import { ownerAuth } from "../middleware/ownerAuth.js";
import Booking from "../models/Booking.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/owner/refunds/:bookingId
router.post("/:bookingId", ownerAuth, async (req, res) => {
    try {
        const { bookingId } = req.params;

        // 1) Find booking
        const booking = await Booking.findById(bookingId)
            .populate("hotel"); // ensure we can check owner

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // 2) Verify owner actually owns this hotel
        if (!booking.hotel || String(booking.hotel.ownerId) !== String(req.owner._id)) {
            return res.status(403).json({ error: "Not authorized to refund this booking" });
        }

        // 3) Must be paid
        if (booking.paymentStatus !== "paid") {
            return res.status(400).json({ error: "Only PAID bookings can be refunded" });
        }

        if (!booking.stripePaymentIntentId) {
            return res.status(400).json({ error: "No payment intent stored for this booking" });
        }

        // 4) Create Stripe refund (TEST MODE - uses your test key)
        const refund = await stripe.refunds.create({
            payment_intent: booking.stripePaymentIntentId,
            // amount: Math.round(booking.totalPrice * 100), // optional: partial or full
        });

        // 5) Update booking
        booking.paymentStatus = "refunded";
        booking.status = "cancelled";
        await booking.save();

        return res.json({
            success: true,
            message: "Refund processed",
            refundId: refund.id,
        });

    } catch (err) {
        console.error("🔥 Refund error:", err);
        res.status(500).json({ error: "Refund failed" });
    }
});

export default router;
