// backend/controllers/hotelController.js
import Hotel from "../models/Hotel.js";

// UPDATE HOTEL
export const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.owner._id;

        const updated = await Hotel.findOneAndUpdate(
            { _id: id, ownerId },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res
                .status(404)
                .json({ error: "Hotel not found or not owned by this owner" });
        }

        res.json(updated);

    } catch (err) {
        console.error("Update hotel error:", err);
        res.status(500).json({ error: "Failed to update hotel" });
    }
};


// DELETE HOTEL (if you want later)
export const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.owner._id;

        const deleted = await Hotel.findOneAndDelete({ _id: id, ownerId });

        if (!deleted) {
            return res
                .status(404)
                .json({ error: "Hotel not found or not owned by this owner" });
        }

        res.json({ message: "Hotel deleted successfully" });

    } catch (err) {
        console.error("Delete hotel error:", err);
        res.status(500).json({ error: "Failed to delete hotel" });
    }
};
