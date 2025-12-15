import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

export const getOwnerAnalytics = async (req, res) => {
    try {
        const ownerId = req.ownerId;

        // 1) Get all hotels owned by this owner
        const hotels = await Hotel.find({ owner: ownerId }).select("_id name");

        const hotelIds = hotels.map(h => h._id);

        // 2) All bookings for these hotels
        const bookings = await Booking.find({ hotel: { $in: hotelIds } });

        // 3) Total bookings
        const totalBookings = bookings.length;

        // 4) Earnings total
        const totalEarnings = bookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);

        // 5) Upcoming bookings
        const now = new Date();
        const upcomingBookings = bookings.filter(b => new Date(b.checkInDate) > now).length;

        // 6) Monthly earnings breakdown
        const monthly = {};
        bookings.forEach(b => {
            const month = new Date(b.checkInDate).toLocaleString("default", { month: "short" });
            monthly[month] = (monthly[month] || 0) + (b.amountPaid || 0);
        });

        // 7) Per-hotel earnings
        const perHotel = {};
        hotels.forEach(hotel => {
            const hotelTotal = bookings
                .filter(b => String(b.hotel) === String(hotel._id))
                .reduce((sum, b) => sum + (b.amountPaid || 0), 0);

            perHotel[hotel.name] = hotelTotal;
        });

        return res.json({
            totalBookings,
            totalEarnings,
            upcomingBookings,
            monthly,
            perHotel,
        });

    } catch (err) {
        console.error("OWNER ANALYTICS ERROR:", err);
        return res.status(500).json({ message: "Server error generating analytics" });
    }
};
