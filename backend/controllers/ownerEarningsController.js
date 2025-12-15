// backend/controllers/ownerEarningsController.js

import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

const ownerEarningsController = {
    async getMonthlyEarnings(req, res) {
        try {
            const ownerId = req.ownerId;

            const hotels = await Hotel.find({ ownerId }).select("_id");
            const hotelIds = hotels.map(h => h._id);

            if (hotelIds.length === 0) {
                return res.json({
                    gross: "0.00",
                    fee: "0.00",
                    net: "0.00",
                    bookingsCount: 0,
                });
            }

            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const now = new Date();

            const bookings = await Booking.find({
                hotel: { $in: hotelIds },
                paymentStatus: "PAID",
                createdAt: { $gte: startOfMonth, $lte: now },
            });

            const gross = bookings.reduce(
                (sum, b) => sum + Number(b.totalPrice || 0),
                0
            );

            const fee = gross * 0.12;
            const net = gross - fee;

            res.json({
                gross: gross.toFixed(2),
                fee: fee.toFixed(2),
                net: net.toFixed(2),
                bookingsCount: bookings.length,
            });
        } catch (err) {
            console.error("❌ getMonthlyEarnings error:", err);
            res.status(500).json({ message: "Failed to load earnings" });
        }
    },

    async getPayoutSummary(req, res) {
        try {
            const ownerId = req.ownerId;

            const hotels = await Hotel.find({ ownerId }).select("_id");
            const hotelIds = hotels.map(h => h._id);

            if (hotelIds.length === 0) {
                return res.json({ pending: "0.00", paid: "0.00" });
            }

            const bookings = await Booking.find({
                hotel: { $in: hotelIds },
                paymentStatus: "PAID",
            });

            let pending = 0;
            let paid = 0;

            bookings.forEach(b => {
                const ownerShare = Number(b.totalPrice || 0) * 0.88;
                if (b.payoutStatus === "paid") paid += ownerShare;
                else pending += ownerShare;
            });

            res.json({
                pending: pending.toFixed(2),
                paid: paid.toFixed(2),
            });
        } catch (err) {
            console.error("❌ getPayoutSummary error:", err);
            res.status(500).json({ message: "Failed to load payout summary" });
        }
    },
};

export default ownerEarningsController;
