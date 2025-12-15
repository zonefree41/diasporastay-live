import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

export const getOwnerPayoutHistory = async (req, res) => {
    try {
        const ownerId = req.ownerId;

        // Find owner hotels
        const hotels = await Hotel.find({ ownerId }).select("_id name");
        const hotelMap = new Map(hotels.map(h => [h._id.toString(), h.name]));
        const hotelIds = hotels.map(h => h._id);

        if (hotelIds.length === 0) {
            return res.json([]);
        }

        const bookings = await Booking.find({
            hotel: { $in: hotelIds },
            paymentStatus: "PAID",
        }).sort({ createdAt: -1 });

        const result = bookings.map(b => {
            const ownerEarningsUSD = (Number(b.totalPrice) * 0.88).toFixed(2);
            const ownerEarningsETB =
                b.exchangeRate
                    ? (Number(ownerEarningsUSD) * b.exchangeRate).toFixed(2)
                    : null;

            return {
                bookingId: b._id,
                hotelName: hotelMap.get(b.hotel.toString()) || "—",
                createdAt: b.createdAt,
                currency: b.currency || "USD",
                ownerEarningsUSD,
                ownerEarningsETB,
                payoutStatus: b.payoutStatus || "pending",
                payoutMethod: b.payoutMethod || null,
                paidAt: b.paidAt || null,
            };
        });

        res.json(result);
    } catch (err) {
        console.error("❌ getOwnerPayoutHistory error:", err);
        res.status(500).json({ message: "Failed to load payout history" });
    }
};
