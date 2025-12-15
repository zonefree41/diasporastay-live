import Booking from "../models/Booking.js";

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            guestId: req.guestId,
            paymentStatus: "PAID", // ✅ reliable filter
        })
            .populate("hotel", "name city country images")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

