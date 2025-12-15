export const getNextPayoutInfo = async (req, res) => {
    try {
        const today = new Date();

        // Find next Friday
        const nextFriday = new Date(today);
        const day = today.getDay(); // 0 = Sun, 5 = Fri
        const daysUntilFriday = (5 - day + 7) % 7 || 7;
        nextFriday.setDate(today.getDate() + daysUntilFriday);
        nextFriday.setHours(0, 0, 0, 0);

        res.json({
            nextPayoutDate: nextFriday,
            message: "Payouts are processed weekly on Fridays",
        });
    } catch (err) {
        console.error("❌ getNextPayoutInfo error:", err);
        res.status(500).json({ message: "Failed to load payout info" });
    }
};
