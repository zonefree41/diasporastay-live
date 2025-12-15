import express from "express";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// PUBLIC – GET HOTEL BY ID
router.get("/:id", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ error: "Hotel not found" });

        res.json(hotel);
    } catch (err) {
        console.error("Public hotel fetch error:", err);
        res.status(500).json({ error: "Failed to fetch hotel" });
    }
});

export default router;
