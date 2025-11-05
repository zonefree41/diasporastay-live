import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    hotelId: String,
    hotelName: String,
    city: String,
    country: String,
    guests: Number,
    nights: Number,
    total: Number,
    email: String,
    stripeSessionId: String,
    status: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
