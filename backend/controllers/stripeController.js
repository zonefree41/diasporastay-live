import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

// ✅ DEFINE FIRST (TOP OF FILE)
const FRONTEND_URL = process.env.FRONTEND_URL;

console.log("🔁 STRIPE REDIRECT URL IN USE:", FRONTEND_URL);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc   Create Stripe Checkout Session
 * @route  POST /api/stripe/create-checkout-session
 * @access Guest
 */
export const createCheckoutSession = async (req, res) => {
    try {
        const {
            hotelId,
            guestId,
            checkIn,
            checkOut,
            nights,
            totalPrice,
        } = req.body;

        if (!FRONTEND_URL) {
            throw new Error("FRONTEND_URL is not defined in environment variables");
        }

        // 🛑 Validate input
        if (!hotelId || !guestId || !checkIn || !checkOut || !totalPrice) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 🏨 Verify hotel exists
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        // 1️⃣ Create booking (PENDING)
        const booking = await Booking.create({
            hotel: hotelId,
            guest: guestId,
            checkIn,
            checkOut,
            nights,
            totalPrice,
            status: "PENDING",
        });

        console.log("🟡 Booking created (PENDING):", booking._id.toString());

        // 2️⃣ Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${FRONTEND_URL}/booking/cancelled`,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: hotel.name,
                            description: `Booking for ${nights} night(s)`,
                        },
                        unit_amount: Math.round(totalPrice * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                bookingId: booking._id.toString(),
            },
        });

        console.log("🟢 Stripe session created:", session.id);

        res.status(201).json({
            url: session.url,
            bookingId: booking._id,
        });
    } catch (error) {
        console.error("❌ Stripe error:", error);
        res.status(500).json({
            message: error.message || "Failed to create checkout session",
        });
    }
};
