import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "../models/Hotel.js";

dotenv.config();

const DEFAULT_PRICE = 120; // 👈 choose a safe default

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // Find hotels missing pricePerNight
        const hotels = await Hotel.find({
            $or: [
                { pricePerNight: { $exists: false } },
                { pricePerNight: null },
            ],
        });

        console.log(`🔎 Found ${hotels.length} hotels to update`);

        for (const hotel of hotels) {
            hotel.pricePerNight = DEFAULT_PRICE;
            await hotel.save();
            console.log(`💾 Updated: ${hotel.name}`);
        }

        console.log("🎉 Migration complete");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

migrate();
