import express from "express";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// PUBLIC – GET HOTEL BY ID
router.get("/:id", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.json(hotel);
    } catch (err) {
        console.error("PUBLIC HOTEL LOAD ERROR:", err);
        res.status(500).json({ message: "Failed to load hotel" });
    }
});


export default router;
