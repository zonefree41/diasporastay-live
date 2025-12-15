// backend/routes/bookingRoutes.js
import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ======================================================
   CREATE BOOKING + STRIPE CHECKOUT
====================================================== */
router.post("/create-checkout", async (req, res) => {
    try {
        console.log("🟦 Incoming booking request:", req.body);

        const {
            hotelId,
            guestId,
            checkIn,
            checkOut,
            nights,
            totalPrice,
        } = req.body;

        // 1️⃣ Validate hotel
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(400).json({ error: "Hotel not found" });
        }

        // 2️⃣ Create booking FIRST (pending)
        const booking = await Booking.create({
            guestId,
            hotel: hotelId,
            checkIn,
            checkOut,
            nights,
            pricePerNight: totalPrice / nights,
            totalPrice,
            paymentStatus: "pending",
            status: "active",
            hotelSnapshot: {
                name: hotel.name,
                city: hotel.city,
                country: hotel.country,
                images: hotel.images || [],
            },
        });

        console.log("🟡 Booking created (PENDING):", booking._id.toString());

        // 3️⃣ Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],

            success_url: "http://localhost:5175/booking/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5175/booking/cancel",


            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: Math.round(totalPrice * 100),
                        product_data: {
                            name: `Booking: ${hotel.name}`,
                            description: `${nights} night(s)`,
                        },
                    },
                    quantity: 1,
                },
            ],

            metadata: {
                bookingId: booking._id.toString(),
                hotelId,
                guestId,
            },
        });


        // 4️⃣ Save Stripe session ID to booking
        booking.stripeSessionId = session.id;
        await booking.save();

        console.log("🟢 Stripe session created:", session.id);

        // 5️⃣ Send Stripe URL to frontend
        return res.json({ url: session.url });

    } catch (err) {
        console.error("🔥 Booking checkout error:", err);
        return res.status(500).json({ error: "Failed to create checkout" });
    }
});

export default router;
