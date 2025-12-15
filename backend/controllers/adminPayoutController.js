import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Owner from "../models/Owner.js";

/**
 * =====================================
 * 📋 GET ALL PENDING PAYOUTS
 * Admin-only
 * =====================================
 */
export const getPendingPayouts = async (req, res) => {
    try {
        const bookings = await Booking.find({
            paymentStatus: "PAID",
            payoutStatus: "pending",
        })
            .populate({
                path: "hotel",
                select: "name ownerId",
                populate: {
                    path: "ownerId",
                    select: "name email country",
                },
            })
            .sort({ createdAt: -1 });

        const results = bookings.map((b) => {
            const ownerEarningsUSD = b.totalPrice * 0.88;
            const ownerEarningsETB =
                b.exchangeRate ? ownerEarningsUSD * b.exchangeRate : null;

            return {
                bookingId: b._id,
                hotelName: b.hotel?.name,
                owner: {
                    id: b.hotel?.ownerId?._id,
                    name: b.hotel?.ownerId?.name,
                    email: b.hotel?.ownerId?.email,
                    country: b.hotel?.ownerId?.country,
                },
                currency: b.currency,
                ownerEarningsUSD: ownerEarningsUSD.toFixed(2),
                ownerEarningsETB: ownerEarningsETB
                    ? ownerEarningsETB.toFixed(2)
                    : null,
                payoutStatus: b.payoutStatus,
                createdAt: b.createdAt,
            };
        });

        res.json(results);
    } catch (err) {
        console.error("❌ getPendingPayouts error:", err);
        res.status(500).json({ message: "Failed to load pending payouts" });
    }
};

/**
 * =====================================
 * ✅ MARK PAYOUT AS PAID
 * Admin-only
 * =====================================
 */
export const markPayoutAsPaid = async (req, res) => {
    try {
        const { bookingId, payoutMethod } = req.body;

        if (!bookingId || !payoutMethod) {
            return res.status(400).json({
                message: "bookingId and payoutMethod are required",
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.payoutStatus === "paid") {
            return res.status(400).json({
                message: "Payout already marked as paid",
            });
        }

        booking.payoutStatus = "paid";
        booking.payoutMethod = payoutMethod; // stripe | manual_bank | cash | mobile_money
        booking.paidAt = new Date();

        await booking.save();

        res.json({
            message: "Payout marked as PAID",
            bookingId: booking._id,
            payoutMethod,
            paidAt: booking.paidAt,
        });
    } catch (err) {
        console.error("❌ markPayoutAsPaid error:", err);
        res.status(500).json({ message: "Failed to mark payout as paid" });
    }
};
