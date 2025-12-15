// backend/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        /* ============================
           RELATIONS
        ============================ */
        guestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Guest",
            required: true,
        },

        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
        },

        /* ============================
           DATES
        ============================ */
        checkIn: {
            type: Date,
            required: true,
        },

        checkOut: {
            type: Date,
            required: true,
        },

        nights: {
            type: Number,
            required: true,
        },

        /* ============================
           PRICING
        ============================ */
        pricePerNight: {
            type: Number,
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        /* ============================
           STRIPE
        ============================ */
        stripeSessionId: {
            type: String,
            required: true,
            index: true, // 🔥 webhook lookup speed
        },

        stripePaymentIntentId: {
            type: String,
            default: null, // set by webhook
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },

        /* ============================
           BOOKING STATUS
        ============================ */
        status: {
            type: String,
            enum: ["active", "cancelled", "completed"],
            default: "active",
        },

        /* ============================
           SNAPSHOT (IMPORTANT)
        ============================ */
        hotelSnapshot: {
            name: String,
            city: String,
            country: String,
            images: [String],
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
