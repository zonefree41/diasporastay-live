import express from "express";
import Message from "../models/Message.js";
import Booking from "../models/Booking.js";
import protectGuest from "../middleware/protectGuest.js";
import protectOwner from "../middleware/protectOwner.js";

const router = express.Router();

/* ================= GET MESSAGES ================= */
router.get("/:bookingId", async (req, res) => {
    try {
        const messages = await Message.find({
            booking: req.params.bookingId,
        }).sort("createdAt");

        res.json(messages);
    } catch {
        res.status(500).json({ message: "Failed to load messages" });
    }
});

/* ================= SEND MESSAGE ================= */
router.post("/:bookingId", async (req, res) => {
    const { text, senderRole, senderId } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Message required" });
    }

    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const message = await Message.create({
            booking: booking._id,
            senderRole,
            senderId,
            text,
        });

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: "Failed to send message" });
    }
});

export default router;
