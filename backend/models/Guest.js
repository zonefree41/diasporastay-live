import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        email: { type: String, required: true, unique: true },

        password: { type: String, required: true },

        // For password-reset flow
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },

        // Optional phone number for future features
        phone: { type: String },

        country: { type: String },

        avatarUrl: { type: String }, // ⭐ NEW

        // Optional avatar for profile page (future luxury upgrade)
        avatar: { type: String, default: "" },

        // Guest booking history (can store booking IDs)
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
        ],
    },
    { timestamps: true }
);

const Guest = mongoose.model("Guest", guestSchema);

export default Guest;
