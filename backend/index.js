// index.js (DiasporaStay Backend)
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import MongoStore from "connect-mongo";
import session from "express-session";
import Stripe from "stripe";
import ownerStripeConnectRoutes from "./routes/ownerStripeConnectRoutes.js";


/* ======================================================
   APP + STRIPE INIT
====================================================== */
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ======================================================
   🟢 STRIPE WEBHOOK — MUST BE FIRST + RAW BODY
====================================================== */
app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        console.log("🔔 Stripe webhook hit");

        const sig = req.headers["stripe-signature"];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("❌ Webhook signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log("📦 Stripe event:", event.type);

        try {
            const Booking = (await import("./models/Booking.js")).default;

            // ✅ PAYMENT SUCCESS
            if (event.type === "checkout.session.completed") {
                const sessionObj = event.data.object;

                const booking = await Booking.findOne({
                    stripeSessionId: sessionObj.id,
                });

                if (!booking) {
                    console.warn("⚠️ Booking not found for session:", sessionObj.id);
                } else {
                    booking.paymentStatus = "PAID";
                    booking.status = "CONFIRMED";
                    booking.stripePaymentIntentId = sessionObj.payment_intent;
                    await booking.save();

                    console.log("✅ BOOKING CONFIRMED:", booking._id.toString());
                }
            }

            // ❌ PAYMENT FAILED / EXPIRED
            if (
                event.type === "checkout.session.expired" ||
                event.type === "checkout.session.async_payment_failed"
            ) {
                const sessionObj = event.data.object;

                const booking = await Booking.findOne({
                    stripeSessionId: sessionObj.id,
                });

                if (booking) {
                    booking.paymentStatus = "FAILED";
                    booking.status = "CANCELLED";
                    await booking.save();

                    console.log("🔴 BOOKING FAILED:", booking._id.toString());
                }
            }

            res.json({ received: true });
        } catch (err) {
            console.error("🔥 Webhook handler error:", err);
            res.status(500).send("Webhook handler error");
        }
    }
);

/* ======================================================
   🧠 BODY PARSERS (AFTER WEBHOOK)
====================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   🌍 CORS
====================================================== */
app.use(
    cors({
        origin: [
            "http://localhost:5175",
            "https://diasporastay.com",
            "https://www.diasporastay.com"
        ],
        credentials: true,
    })
);


/* ======================================================
   🗝️ SESSION
====================================================== */
app.use(
    session({
        secret: process.env.SESSION_SECRET || "ds_secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions",
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
);

/* ======================================================
   📦 ROUTES
====================================================== */
import hotelRoutes from "./routes/hotelRoutes.js";
import hotelPublicRoutes from "./routes/hotelPublicRoutes.js";

import ownerAuthRoutes from "./routes/ownerAuthRoutes.js";
import ownerHotelRoutes from "./routes/ownerHotelRoutes.js";
import ownerBookingRoutes from "./routes/ownerBookingRoutes.js";
import ownerProfileRoutes from "./routes/ownerProfile.js";
import ownerStripeRoutes from "./routes/ownerStripeRoutes.js";
import ownerRefundRoutes from "./routes/ownerRefundRoutes.js";
import ownerAnalyticsRoutes from "./routes/ownerAnalyticsRoutes.js";
import ownerEarningsRoutes from "./routes/ownerEarningsRoutes.js";
import ownerPayoutHistoryRoutes from "./routes/ownerPayoutHistoryRoutes.js";
import ownerPayoutInfoRoutes from "./routes/ownerPayoutInfoRoutes.js";

import guestRoutes from "./routes/guestRoutes.js";
import guestAuthRoutes from "./routes/guestAuthRoutes.js";

import bookingRoutes from "./routes/bookingRoutes.js";
import bookingConfirmRoutes from "./routes/bookingConfirmRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";

import adminHotelRoutes from "./routes/adminHotelRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import seedBookings from "./routes/seedBookings.js";
import adminPayoutRoutes from "./routes/adminPayoutRoutes.js";

/* ======================================================
   🚦 API ROUTES
====================================================== */
app.use("/api/stripe", stripeRoutes);

app.use("/api/hotels", hotelRoutes);
app.use("/api/hotels", hotelPublicRoutes);

app.use("/api/owner/auth", ownerAuthRoutes);
app.use("/api/owner/hotels", ownerHotelRoutes);
app.use("/api/owner/bookings", ownerBookingRoutes);
app.use("/api/owner/profile", ownerProfileRoutes);
app.use("/api/owner/stripe", ownerStripeRoutes);
app.use("/api/owner/refunds", ownerRefundRoutes);
app.use("/api/owner/analytics", ownerAnalyticsRoutes);
app.use("/api/owner/stripe/connect", ownerStripeConnectRoutes);
app.use("/api/owner/earnings", ownerEarningsRoutes);
app.use("/api/owner/payouts", ownerPayoutHistoryRoutes);
app.use("/api/owner/payout-info", ownerPayoutInfoRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/guests", guestAuthRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/bookings", bookingConfirmRoutes);

app.use("/api/admin/hotels", adminHotelRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/seed-bookings", seedBookings);
app.use("/api/admin/payouts", adminPayoutRoutes);



/* ======================================================
   🚨 ERROR HANDLER
====================================================== */
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
});

/* ======================================================
   🟢 CONNECT DB + START SERVER
====================================================== */
const PORT = 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => {
            console.log(`🚀 Backend listening on port ${PORT}`);
            console.log(
                "🔑 Stripe key in use:",
                process.env.STRIPE_SECRET_KEY?.slice(0, 12) + "..."
            );
        });
    })
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
