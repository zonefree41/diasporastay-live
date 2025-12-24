// backend/routes/ownerHotelRoutes.js
import express from "express";
import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";
import { protectOwner } from "../middleware/protectOwner.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// ✅ MULTER SETUP (THIS WAS MISSING)
const upload = multer({ dest: "uploads/" });

const router = express.Router();

/* ======================================================
   OWNER: GET ALL HOTELS
   GET /api/owner/hotels/my-hotels
====================================================== */
router.get("/my-hotels", protectOwner, async (req, res) => {
    try {
        const hotels = await Hotel.find({ ownerId: req.owner._id })
            .sort({ createdAt: -1 });

        res.json(hotels);
    } catch (err) {
        console.error("MY HOTELS ERROR:", err);
        res.status(500).json({ message: "Failed to load hotels" });
    }
});

/* ======================================================
   OWNER: GET SINGLE HOTEL
   GET /api/owner/hotels/:id
====================================================== */
router.get("/:id", protectOwner, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }

        const hotel = await Hotel.findOne({
            _id: req.params.id,
            ownerId: req.owner._id,
        });

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.json(hotel);
    } catch (err) {
        console.error("LOAD HOTEL ERROR:", err);
        res.status(500).json({ message: "Failed to load hotel" });
    }
});

/* ======================================================
   OWNER: UPDATE HOTEL (EDIT)
   PUT /api/owner/hotels/:id
====================================================== */
router.put(
    "/:id",
    protectOwner,
    upload.array("images", 10),
    async (req, res) => {
        try {
            const hotel = await Hotel.findOne({
                _id: req.params.id,
                ownerId: req.owner._id,
            });

            if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            const {
                name,
                city,
                country,
                description,
                pricePerNight,
                minNights,
                existingImages,
            } = req.body;

            // ✅ BASIC FIELDS
            hotel.name = name;
            hotel.city = city;
            hotel.country = country;
            hotel.description = description;
            hotel.pricePeriNight = undefined; // safeguard legacy typo
            hotel.pricePerNight = Number(pricePerNight);
            hotel.minNights = Number(minNights || 2);

            // ✅ KEEP EXISTING IMAGES
            let images = [];
            if (existingImages) {
                images = JSON.parse(existingImages);
            }

            // ✅ UPLOAD NEW IMAGES TO CLOUDINARY
            if (req.files?.length) {
                for (const file of req.files) {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "diasporastay",
                    });
                    images.push(result.secure_url);
                }
            }

            hotel.images = images;
            await hotel.save();

            res.json({ success: true, hotel });
        } catch (err) {
            console.error("UPDATE HOTEL ERROR:", err);
            res.status(500).json({ message: "Failed to update hotel" });
        }
    }
);

// GET availability
router.get("/:id/availability", protectOwner, async (req, res) => {
    const hotel = await Hotel.findOne({
        _id: req.params.id,
        ownerId: req.owner._id,
    });

    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    res.json({
        hotelName: hotel.name,
        blockedDates: hotel.blockedDates || [],
    });
});


// SAVE availability
router.put("/:id/availability", protectOwner, async (req, res) => {
    const { blockedDates } = req.body;

    if (!Array.isArray(blockedDates)) {
        return res.status(400).json({ message: "blockedDates must be an array" });
    }

    const hotel = await Hotel.findOne({
        _id: req.params.id,
        ownerId: req.owner._id,
    });

    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    hotel.blockedDates = blockedDates.map((d) => new Date(d));
    await hotel.save();

    res.json({ success: true });
});


export default router;
