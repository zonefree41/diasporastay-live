// backend/routes/hotelPublicRoutes.js
import express from "express";
import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";

const router = express.Router();

/* ===============================
   PUBLIC: GET ALL HOTELS
=============================== */
router.get("/", async (req, res) => {
    try {
        const hotels = await Hotel.find({ isActive: { $ne: false } })
            .sort({ createdAt: -1 });

        res.json(hotels);
    } catch (err) {
        console.error("PUBLIC HOTELS ERROR:", err);
        res.status(500).json({ error: "Failed to load hotels" });
    }
});

/* ===============================
   PUBLIC: GET SINGLE HOTEL
   ✅ THIS FIXES YOUR ERROR
=============================== */
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid hotel ID" });
        }

        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }

        res.json(hotel);
    } catch (err) {
        console.error("PUBLIC HOTEL LOAD ERROR:", err);
        res.status(500).json({ error: "Failed to load hotel" });
    }
});

export default router;
