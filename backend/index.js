console.log("🔔 Stripe webhook received");


// backend/index.js
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import stripe from "./config/stripe.js";
import sendEmail from "./utils/sendEmail.js";

/* =========================
   ROUTES IMPORTS
========================= */
import hotelRoutes from "./routes/hotelRoutes.js";
import hotelPublicRoutes from "./routes/hotelPublicRoutes.js";

import ownerAuthRoutes from "./routes/ownerAuthRoutes.js";
import ownerHotelRoutes from "./routes/ownerHotelRoutes.js";
import ownerBookingRoutes from "./routes/ownerBookingRoutes.js";
import ownerProfileRoutes from "./routes/ownerProfile.js";
import ownerStripeRoutes from "./routes/ownerStripeRoutes.js";
import ownerRefundRoutes from "./routes/ownerRefundRoutes.js";
import ownerAnalyticsRoutes from "./routes/ownerAnalyticsRoutes.js";
import ownerStripeConnectRoutes from "./routes/ownerStripeConnectRoutes.js";
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
import adminPayoutRoutes from "./routes/adminPayoutRoutes.js";

import seedBookings from "./routes/seedBookings.js";

/* =========================
   APP INIT
========================= */
const app = express();

console.log("ENV STRIPE KEY =", process.env.STRIPE_SECRET_KEY?.slice(0, 12) + "...");

/* =========================
   CORS (GLOBAL + SAFE)
========================= */
app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
    res.json({
        status: "OK",
        service: "DiasporaStay Backend",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

/* =========================
   STRIPE WEBHOOK (RAW BODY)
========================= */
app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        console.log("🔔 Stripe webhook received");

        const sig = req.headers["stripe-signature"];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error("❌ Webhook signature failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        try {
            if (event.type === "checkout.session.completed") {
                const session = event.data.object;

                const Booking = (await import("./models/Booking.js")).default;
                const Hotel = (await import("./models/Hotel.js")).default;
                const Guest = (await import("./models/Guest.js")).default;
                const Owner = (await import("./models/Owner.js")).default;

                const booking = await Booking.findOne({
                    stripeSessionId: session.id,
                });

                if (!booking) {
                    console.warn("⚠️ Booking not found:", session.id);
                    return res.json({ received: true });
                }

                booking.paymentStatus = "PAID";
                booking.status = "CONFIRMED";
                booking.stripePaymentIntentId = session.payment_intent || null;
                await booking.save();

                const hotel = await Hotel.findById(booking.hotel);
                if (hotel) {
                    const start = new Date(booking.checkIn);
                    const end = new Date(booking.checkOut);

                    const datesToBlock = [];
                    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
                        datesToBlock.push(new Date(d));
                    }

                    hotel.blockedDates = Array.from(
                        new Set(
                            [...hotel.blockedDates, ...datesToBlock].map((d) =>
                                new Date(d).toISOString()
                            )
                        )
                    ).map((d) => new Date(d));

                    await hotel.save();
                }

                // ==============================
                // 📩 EMAIL OWNER ON BOOKING
                // ==============================
                const guest = await Guest.findById(booking.guestId);
                const owner = hotel ? await Owner.findById(hotel.ownerId) : null;

                if (owner?.email && hotel && guest) {
                    try {
                        await sendEmail({
                            to: owner.email,
                            subject: "🏨 New Booking Confirmed",
                            html: `
                <h2>New Booking Confirmed</h2>

                <p><strong>Hotel:</strong> ${hotel.name}</p>

                <p><strong>Guest:</strong> ${guest.name || "Guest"}<br/>
                <strong>Email:</strong> ${guest.email}</p>

                <p><strong>Dates:</strong><br/>
                ${new Date(booking.checkIn).toDateString()} → 
                ${new Date(booking.checkOut).toDateString()}</p>

                <p><strong>Nights:</strong> ${booking.nights}</p>

                <p><strong>Total:</strong> $${booking.totalPrice}</p>

                <hr/>
                <p>DiasporaStay</p>
            `,
                        });

                        console.log("📧 Owner email sent:", owner.email);
                    } catch (emailErr) {
                        console.error("❌ Failed to send owner email:", emailErr.message);
                    }
                }

                console.log("✅ Booking confirmed & dates blocked:", booking._id);
            }

            return res.json({ received: true });
        } catch (err) {
            console.error("🔥 Webhook processing error:", err);
            return res.status(500).send("Webhook handler failed");
        }
    }
);


/* =========================
   BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   SESSION
========================= */
app.use(
    session({
        secret: process.env.SESSION_SECRET || "ds_secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions",
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        },
    })
);

/* =========================
   ROUTES
========================= */
app.use("/api/stripe", stripeRoutes);

app.use("/api/hotels", hotelRoutes);
app.use("/api/hotels", hotelPublicRoutes);

// Owner
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

// Guests
app.use("/api/guests", guestRoutes);
app.use("/api/guests", guestAuthRoutes);

// Bookings
app.use("/api/bookings", bookingRoutes);
app.use("/api/bookings", bookingConfirmRoutes);

// Admin
app.use("/api/admin/hotels", adminHotelRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/payouts", adminPayoutRoutes);

// Seed
app.use("/api/seed-bookings", seedBookings);

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
});

/* =========================
   CONNECT DB + START SERVER
========================= */
const PORT = process.env.PORT || 5000;

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
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
    });
