import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Owner from "../models/Owner.js";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// ===== ADMIN LOGIN =====
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL)
        return res.status(401).send("Unauthorized");

    if (password !== process.env.ADMIN_PASSWORD)
        return res.status(401).send("Unauthorized");

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.json({ token });
});

// ===== GET ALL HOTELS =====
router.get("/hotels", async (req, res) => {
    const hotels = await Hotel.find().populate("owner");
    res.json(hotels);
});

// ===== APPROVE HOTEL =====
router.put("/hotels/approve/:id", async (req, res) => {
    await Hotel.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.send("Hotel approved");
});

// ===== DELETE HOTEL =====
router.delete("/hotels/:id", async (req, res) => {
    await Hotel.findByIdAndDelete(req.params.id);
    res.send("Hotel deleted");
});

// ===== GET ALL OWNERS =====
router.get("/owners", async (req, res) => {
    const owners = await Owner.find();

    const ownerData = await Promise.all(
        owners.map(async (o) => ({
            ...o._doc,
            hotelsCount: await Hotel.countDocuments({ owner: o._id }),
        }))
    );

    res.json(ownerData);
});

export default router;
