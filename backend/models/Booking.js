// backend/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        guestId: { type: mongoose.Schema.Types.ObjectId, ref: "Guest", required: true },

        // THIS must be "hotel" (your routes expect this)
        hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },

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

        stripeSessionId: { type: String, default: null },

        stripePaymentIntentId: { type: String, default: null },

        status: {
            type: String,
            enum: ["active", "cancelled", "completed"],
            default: "active",
        },


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
