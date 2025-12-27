// backend/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        guestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Guest",
            required: true,
        },

        // REQUIRED by your routes
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
        },

        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },

        nights: { type: Number, default: 1 },

        pricePerNight: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 },

        payoutStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },

        // 🔐 STRIPE
        stripeSessionId: { type: String, default: null },
        stripePaymentIntentId: { type: String, default: null },

        // 💳 REFUND TRACKING (NEW)
        refundId: { type: String },
        refundStatus: { type: String },

        // 🔁 REFUND TRACKING
        refunded: { type: Boolean, default: false },
        refundAmount: { type: Number, default: 0 },
        refundedAt: Date,

        // ✅ NORMALIZED STATUS
        status: {
            type: String,
            enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
            default: "CONFIRMED",
        },

        status: {
            type: String,
            enum: ["active", "cancelled", "completed"],
            default: "active",
        },

        // 🔁 REFUND POLICY
        refundPolicy: {
            type: String,
            enum: ["FLEXIBLE_24H", "MODERATE_48H", "NON_REFUNDABLE"],
            default: "MODERATE_48H",
        },

        // SNAPSHOT (used in MyBookings.jsx)
        hotelSnapshot: {
            name: String,
            city: String,
            country: String,
            images: [String],
        },
    },
    { timestamps: true }
);


const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
