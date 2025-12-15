import Owner from "../models/Owner.js";

export const getOwnerProfile = async (req, res) => {
    try {
        const owner = await Owner.findById(req.ownerId).select("-password");
        res.json(owner);
    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
};

export const updateOwnerProfile = async (req, res) => {
    try {
        const { name, phone, country, avatar } = req.body;

        const updated = await Owner.findByIdAndUpdate(
            req.ownerId,
            { name, phone, country, avatar },
            { new: true }
        ).select("-password");

        res.json({ message: "Profile updated successfully", user: updated });
    } catch (err) {
        res.status(500).json({ message: "Update failed", err });
    }
};
