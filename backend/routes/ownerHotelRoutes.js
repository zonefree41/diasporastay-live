import express from "express";
import { ownerAuth } from "../middleware/ownerAuth.js";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// UPDATE DAILY PRICE
router.post("/:id/price", ownerAuth, async (req, res) => {
    try {
        const { date, price } = req.body;

        const hotel = await Hotel.findOne({ _id: req.params.id, ownerId: req.owner._id });
        if (!hotel) return res.status(404).json({ error: "Hotel not found" });

        hotel.dailyPrices.set(date, price);
        await hotel.save();

        res.json({ success: true, dailyPrices: hotel.dailyPrices });
    } catch (err) {
        console.error("Price update error:", err);
        res.status(500).json({ error: "Failed to update price" });
    }
});


/* =============================
      OWNER: GET ALL HOTELS
============================== */
router.get("/", ownerAuth, async (req, res) => {
    try {
        const hotels = await Hotel.find({ ownerId: req.owner._id });
        res.json(hotels);
    } catch (err) {
        console.error("Load owner hotels error:", err);
        res.status(500).json({ error: "Failed to load owner hotels" });
    }
});

/* =============================
      OWNER: SET AVAILABILITY
============================== */
router.post("/:id/availability", ownerAuth, async (req, res) => {
    try {
        const { dates } = req.body;

        const hotel = await Hotel.findOne({
            _id: req.params.id,
            ownerId: req.owner._id
        });

        if (!hotel) return res.status(404).json({ error: "Hotel not found" });

        hotel.unavailableDates = dates;
        await hotel.save();

        res.json({ success: true, unavailableDates: hotel.unavailableDates });

    } catch (err) {
        console.error("Availability update error:", err);
        res.status(500).json({ error: "Failed to update availability" });
    }
});


/* =============================
      OWNER: GET AVAILABILITY
============================== */
router.get("/:id/availability", ownerAuth, async (req, res) => {
    try {
        const hotel = await Hotel.findOne({
            _id: req.params.id,
            ownerId: req.owner._id
        }).select("unavailableDates");

        if (!hotel) return res.status(404).json({ error: "Hotel not found" });

        res.json(hotel.unavailableDates || []);

    } catch (err) {
        console.error("Load availability error:", err);
        res.status(500).json({ error: "Failed to load availability" });
    }
});


/* =============================
      OWNER: CREATE HOTEL
============================== */
router.post("/create", ownerAuth, async (req, res) => {
    try {
        const hotel = new Hotel({
            ...req.body,
            ownerId: req.owner._id
        });

        await hotel.save();
        res.status(201).json(hotel);
    } catch (err) {
        console.error("Create hotel error:", err);
        res.status(500).json({ error: "Failed to create hotel" });
    }
});

/* =============================
        OWNER: UPDATE HOTEL
============================== */
router.put("/:id", ownerAuth, async (req, res) => {
    try {
        const updated = await Hotel.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.owner._id },
            req.body,
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "Hotel not found" });

        res.json(updated);
    } catch (err) {
        console.error("Update hotel error:", err);
        res.status(500).json({ error: "Failed to update hotel" });
    }
});

/* =============================
      OWNER: GET SINGLE HOTEL
============================== */
router.get("/:id", ownerAuth, async (req, res) => {
    try {
        const hotel = await Hotel.findOne({
            _id: req.params.id,
            ownerId: req.owner._id
        });

        if (!hotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }

        res.json(hotel);
    } catch (err) {
        console.error("Load single hotel error:", err);
        res.status(500).json({ error: "Failed to load hotel" });
    }
});


/* =============================
      OWNER: MANAGE AVAILABILITY
============================== */
router.post("/:id/availability", ownerAuth, async (req, res) => {
    try {
        const { dates } = req.body;

        const hotel = await Hotel.findOne({
            _id: req.params.id,
            ownerId: req.owner._id
        });

        if (!hotel) return res.status(404).json({ error: "Hotel not found" });

        hotel.unavailableDates = dates;
        await hotel.save();

        res.json(hotel);

    } catch (err) {
        console.error("Availability error:", err);
        res.status(500).json({ error: "Failed to update availability" });
    }
});

/* =============================
      OWNER: DELETE HOTEL
============================== */
router.delete("/:id", ownerAuth, async (req, res) => {
    try {
        const deleted = await Hotel.findOneAndDelete({
            _id: req.params.id,
            ownerId: req.owner._id
        });

        if (!deleted) {
            return res.status(404).json({ error: "Hotel not found" });
        }

        return res.json({ success: true, message: "Hotel deleted successfully" });

    } catch (err) {
        console.error("Delete hotel error:", err);
        return res.status(500).json({ error: "Failed to delete hotel" });
    }
});

export default router;
