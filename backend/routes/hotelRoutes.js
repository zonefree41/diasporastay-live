import express from "express";
import Hotel from "../models/Hotel.js";

const router = express.Router();

/* ========= OWNER AUTH ========== */
function ownerAuth(req, res, next) {
    if (!req.session || !req.session.ownerId) {
        return res.status(401).json({ error: "Owner not authenticated" });
    }
    req.ownerId = req.session.ownerId;
    next();
}

/* ========= 1) SEED HOTELS (must be first!) ========== */
router.get("/seed", async (req, res) => {
    try {
        await Hotel.deleteMany({});

        const sampleHotels = [
            {
                name: "Harmony Hotel Addis",
                city: "Addis Ababa",
                country: "Ethiopia",
                pricePerNight: 95,
                images: [
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
                ],
                amenities: ["WiFi", "Parking", "Breakfast"]
            },
            {
                name: "Golden Tulip Hotel",
                city: "Addis Ababa",
                country: "Ethiopia",
                pricePerNight: 120,
                images: [
                    "https://images.unsplash.com/photo-1551887373-6cc03d12cafa?auto=format&fit=crop&w=900&q=80"
                ],
                amenities: ["WiFi", "Pool", "Gym"]
            }
        ];

        const inserted = await Hotel.insertMany(sampleHotels);

        res.json({
            message: "Hotels seeded successfully!",
            hotels: inserted
        });
    } catch (err) {
        res.status(500).json({ error: "Seed failed", details: err.message });
    }
});

/* ========= 2) GET ALL HOTELS (Public) ========== */
router.get("/", async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ error: "Error fetching hotels" });
    }
});

/* ========= 3) GET ONE HOTEL (Public) ========== */
router.get("/:id", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ error: "Hotel not found" });
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ error: "Invalid hotel ID" });
    }
});

/* ========= 4) GET AVAILABILITY ========== */
router.get("/:id/availability", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ error: "Hotel not found" });

        res.json({ unavailableDates: hotel.unavailableDates });
    } catch (err) {
        res.status(500).json({ error: "Error loading availability" });
    }
});

/* ========= 5) ADD HOTEL (Owner Only) ========== */
router.post("/add", ownerAuth, async (req, res) => {
    try {
        const newHotel = await Hotel.create({
            ownerId: req.ownerId,
            ...req.body
        });

        res.json({ message: "Hotel added", hotel: newHotel });
    } catch (err) {
        res.status(500).json({ error: "Server error adding hotel" });
    }
});

export default router;
