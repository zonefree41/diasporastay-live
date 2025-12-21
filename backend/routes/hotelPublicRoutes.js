import express from "express";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// ✅ PUBLIC: get all hotels
router.get("/", async (req, res) => {
    try {
        const hotels = await Hotel.find({}).sort({ createdAt: -1 });
        res.json(hotels);
    } catch (err) {
        console.error("PUBLIC HOTELS ERROR:", err);
        res.status(500).json({ message: "Failed to load hotels" });
    }
});

// ✅ PUBLIC: get single hotel
router.get("/:id", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.json(hotel);
    } catch (err) {
        console.error("PUBLIC HOTEL ERROR:", err);
        res.status(500).json({ message: "Failed to load hotel" });
    }
});

export default router;

