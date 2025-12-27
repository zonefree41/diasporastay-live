import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },

        senderRole: {
            type: String,
            enum: ["guest", "owner"],
            required: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
