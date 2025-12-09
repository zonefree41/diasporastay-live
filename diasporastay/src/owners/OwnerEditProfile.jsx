import { useState, useEffect } from "react";
import api from "../axios";
import "../styles/profile.css";

export default function OwnerEditProfile() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        country: "",
        avatar: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get("/owner/profile/me");
            setForm({
                name: res.data.name || "",
                phone: res.data.phone || "",
                country: res.data.country || "",
                avatar: res.data.avatar || "",
            });
        } catch (err) {
            setError("Failed to load profile");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await api.put("/owner/profile/update", form);
            setSuccess("Profile updated successfully");
        } catch (err) {
            setError("Update failed");
        }

        setLoading(false);
    };

    return (
        <div className="profile-container">
            <h2 className="profile-title">Edit Profile</h2>

            {success && <div className="success-box">{success}</div>}
            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit} className="profile-form">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} />

                <label>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} />

                <label>Country</label>
                <input name="country" value={form.country} onChange={handleChange} />

                <label>Avatar URL (optional)</label>
                <input name="avatar" value={form.avatar} onChange={handleChange} />

                <button disabled={loading} className="save-btn">
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
