// backend/models/Hotel.js
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
    name: String,
    city: String,
    country: String,
    pricePerNight: Number,
    minNights: { type: Number, default: 2 },
    images: [String],
    refundPolicy: {
        type: String,
        enum: ["FLEXIBLE_24H", "MODERATE_48H", "NON_REFUNDABLE"],
        default: "MODERATE_48H",
    },

    blockedDates: {
        type: [Date],
        default: [],
    },
}, { timestamps: true });


export default mongoose.model("Hotel", hotelSchema);
