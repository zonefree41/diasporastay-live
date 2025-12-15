import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            default: "",
        },

        pricePerNight: {
            type: Number,
            required: true,
        },

        // ⭐ Cloudinary image URLs
        images: {
            type: [String],
            default: [],
        },

        // Amenities list
        amenities: {
            type: [String],
            default: [],
        },

        // ⭐ Blocked dates (availability calendar)
        unavailableDates: {
            type: [Date],
            default: [],
        },

        // Booking count for analytics
        bookingsCount: {
            type: Number,
            default: 0,
        },

        // Hotel rating system (future upgrade)
        rating: {
            type: Number,
            default: 0,
        },

        dailyPrices: {
            type: Map,
            of: Number,
            default: {}
        }
        ,

        // Total reviews count
        reviewsCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
