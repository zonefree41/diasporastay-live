import express from "express";
import Hotel from "../models/Hotel.js";
import { protectOwner } from "../middleware/protectOwner.js";
import { upload } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

/* ======================================================
   OWNER — ADD HOTEL
====================================================== */
router.post(
    "/",
    protectOwner,
    upload.array("images", 10),
    async (req, res) => {
        try {
            console.log("🔵 AUTH OWNER:", req.owner);
            console.log("🔵 BODY RAW:", req.body);
            console.log("🔵 FILES:", req.files);

            const {
                name,
                city,
                country,
                description,
                amenities,
                rooms,
            } = req.body;

            if (!name || !city || !country) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            /* ============================
               PARSE JSON FIELDS
            ============================ */
            const parsedAmenities = amenities ? JSON.parse(amenities) : {};
            const parsedRooms = rooms ? JSON.parse(rooms) : [];

            /* ============================
               UPLOAD IMAGES TO CLOUDINARY
            ============================ */
            const uploadedImages = [];

            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "diasporastay",
                    });
                    uploadedImages.push(result.secure_url);
                }
            }

            /* ============================
               CREATE HOTEL
            ============================ */
            const hotel = await Hotel.create({
                ownerId: req.owner._id, // 🔥 THIS IS THE KEY
                name,
                city,
                country,
                description,
                pricePerNight: Number(pricePerNight),
                amenities: parsedAmenities,
                rooms: parsedRooms,
                images: uploadedImages,
            });


            return res.status(201).json(hotel);

        } catch (error) {
            console.error("ADD HOTEL ERROR:", error);
            return res.status(500).json({
                message: "Failed to add hotel",
            });
        }
    }
);

/* ======================================================
   OWNER — EDIT HOTEL
====================================================== */
router.put(
    "/:id",
    protectOwner,
    upload.array("images", 10),
    async (req, res) => {
        try {
            const hotel = await Hotel.findById(req.params.id);

            if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            // 🔒 Ensure owner owns this hotel
            if (hotel.owner.toString() !== req.owner._id.toString()) {
                return res.status(403).json({ message: "Not authorized" });
            }

            const {
                name,
                city,
                country,
                description,
                amenities,
                rooms,
                existingImages,
            } = req.body;

            // Parse JSON fields
            const parsedAmenities = amenities ? JSON.parse(amenities) : hotel.amenities;
            const parsedRooms = rooms ? JSON.parse(rooms) : hotel.rooms;

            // Keep existing images
            let imageUrls = existingImages ? JSON.parse(existingImages) : hotel.images;

            // Add new uploaded images
            if (req.files && req.files.length > 0) {
                const newImages = req.files.map((file) => file.path);
                imageUrls = [...imageUrls, ...newImages];
            }

            hotel.name = name;
            hotel.city = city;
            hotel.country = country;
            hotel.description = description;
            hotel.amenities = parsedAmenities;
            hotel.rooms = parsedRooms;
            hotel.images = imageUrls;

            await hotel.save();

            res.json(hotel);
        } catch (error) {
            console.error("EDIT HOTEL ERROR:", error);
            res.status(500).json({ message: "Failed to update hotel" });
        }
    }
);


/* ======================================================
   OWNER — GET MY HOTELS
====================================================== */
router.get("/owner/my-hotels", protectOwner, async (req, res) => {
    try {
        const hotels = await Hotel.find({ owner: req.owner._id }).sort({
            createdAt: -1,
        });
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ error: "Failed to load owner hotels" });
    }
});

/* ======================================================
   PUBLIC — GET ALL HOTELS
====================================================== */
router.get("/", async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch hotels" });
    }
});

/* ======================================================
   PUBLIC — GET SINGLE HOTEL
====================================================== */
router.get("/:id", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ error: "Hotel not found" });
        }
        res.json(hotel);
    } catch (err) {
        res.status(400).json({ error: "Invalid hotel ID" });
    }
});

// DELETE /api/hotels/:id
router.delete("/:id", protectOwner, async (req, res) => {
    try {
        const hotel = await Hotel.findOneAndDelete({
            _id: req.params.id,
            ownerId: req.owner._id,
        });

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.json({ message: "Hotel deleted successfully" });
    } catch (err) {
        console.error("DELETE HOTEL ERROR:", err);
        res.status(500).json({ message: "Failed to delete hotel" });
    }
});


export default router;
