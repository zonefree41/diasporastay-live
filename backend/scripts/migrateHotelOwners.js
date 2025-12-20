import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "../models/Hotel.js";
import Owner from "../models/Owner.js";

dotenv.config();

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // Get any owner (adjust if you want specific one)
        const owner = await Owner.findOne();

        if (!owner) {
            console.log("❌ No owner found");
            process.exit(1);
        }

        const hotels = await Hotel.find({
            $or: [
                { ownerId: { $exists: false } },
                { ownerId: null },
            ],
        });

        console.log(`🔎 Found ${hotels.length} hotels to fix`);

        for (const hotel of hotels) {
            hotel.ownerId = owner._id;
            await hotel.save();
            console.log(`✅ Linked hotel: ${hotel.name}`);
        }

        console.log("🎉 Migration complete");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

migrate();
