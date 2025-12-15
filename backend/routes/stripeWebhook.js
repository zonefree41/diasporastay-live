import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
    "/",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        console.log("🔥 WEBHOOK HIT"); // <--- MUST APPEAR

        const sig = req.headers["stripe-signature"];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
            console.log("✅ Webhook signature verified");
        } catch (err) {
            console.error("❌ Webhook signature FAILED:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log("📦 Event type:", event.type);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            console.log("🟢 Session ID:", session.id);
            console.log("🟢 PaymentIntent:", session.payment_intent);

            const booking = await Booking.findOne({
                stripeSessionId: session.id,
            });

            if (!booking) {
                console.error("❌ NO BOOKING FOUND FOR SESSION:", session.id);
                return res.json({ received: true });
            }

            console.log("🎯 BOOKING FOUND:", booking._id);

            booking.paymentStatus = "PAID";
            booking.status = "CONFIRMED";
            booking.stripePaymentIntentId = session.payment_intent;

            await booking.save();

            console.log("✅ BOOKING UPDATED TO PAID / CONFIRMED");
        }

        res.json({ received: true });
    }
);

export default router;
