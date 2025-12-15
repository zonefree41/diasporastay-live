// routes/adminHotelRoutes.js
import express from "express";
import Hotel from "../models/Hotel.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// ===== CREATE HOTEL =====
router.post("/", adminAuth, async (req, res) => {
    try {
        const newHotel = new Hotel(req.body);
        const saved = await newHotel.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: "Error creating hotel", details: err.message });
    }
});

// ===== UPDATE HOTEL =====
router.put("/:id", adminAuth, async (req, res) => {
    try {
        const updated = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "Hotel not found" });

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: "Error updating hotel" });
    }
});

// ===== DELETE HOTEL =====
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const deleted = await Hotel.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({ error: "Hotel not found" });

        res.json({ message: "Hotel deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Error deleting hotel" });
    }
});

export default router;
