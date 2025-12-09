// src/guests/GuestEditProfile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import CountrySelect from "../components/CountrySelect";
import { FaUserCircle, FaSave, FaUpload } from "react-icons/fa";
import "../styles/theme.css";

export default function GuestEditProfile() {
    const navigate = useNavigate();

    const [guest, setGuest] = useState({
        name: "",
        phone: "",
        country: "",
        avatarUrl: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load profile
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem("guestToken");
                if (!token) return navigate("/guest/login");

                const res = await api.get("/api/guests/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const g = res.data.guest;

                setGuest({
                    name: g.name || "",
                    phone: g.phone || "",
                    country: g.country || "",
                    avatarUrl: g.avatarUrl || "",
                });

                setAvatarPreview(g.avatarUrl || "/default-avatar.png");
            } catch {
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    // File upload preview
    const onAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    // Save changes
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("guestToken");

            let avatarUrl = guest.avatarUrl;

            // If new image uploaded → upload to Cloudinary
            if (avatarFile) {
                const formData = new FormData();
                formData.append("file", avatarFile);
                formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                const uploadRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const uploaded = await uploadRes.json();
                avatarUrl = uploaded.secure_url;
            }

            // Update profile
            await api.put(
                "/api/guests/me",
                {
                    name: guest.name,
                    phone: guest.phone,
                    country: guest.country,
                    avatarUrl: avatarUrl,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccess("Profile updated successfully!");

            setTimeout(() => navigate("/guest/profile"), 1200);
        } catch {
            setError("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center my-5">Loading...</div>;

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="edit-profile-card shadow-lg p-4 rounded-4"
                style={{ maxWidth: 600, width: "100%", background: "#fff" }}>

                {/* Header */}
                <div className="text-center mb-4">
                    <FaUserCircle className="gp-avatar-icon-large mb-2" />
                    <h2 className="fw-bold text-gold">Edit Profile</h2>
                </div>

                {/* Alerts */}
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Avatar Section */}
                <div className="d-flex flex-column align-items-center mb-4">
                    <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="avatar-preview mb-2"
                    />

                    <label className="btn btn-outline-primary d-flex align-items-center gap-2">
                        <FaUpload />
                        Choose Photo
                        <input
                            type="file"
                            accept="image/*"
                            className="d-none"
                            onChange={onAvatarChange}
                        />
                    </label>
                </div>

                {/* FORM */}
                <form onSubmit={handleSave}>

                    {/* Full Name */}
                    <label className="form-label fw-semibold mt-2">Full Name</label>
                    <input
                        type="text"
                        className="form-control input-gold"
                        value={guest.name}
                        onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                        required
                    />

                    {/* Phone */}
                    <label className="form-label fw-semibold mt-3">Phone Number</label>
                    <input
                        type="text"
                        className="form-control input-gold"
                        value={guest.phone}
                        onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                    />

                    {/* Country */}
                    <label className="form-label fw-semibold mt-3">Country</label>
                    <CountrySelect
                        value={guest.country}
                        onChange={(val) => setGuest({ ...guest, country: val })}
                    />

                    {/* Save Button */}
                    <button
                        className="btn premium-btn-filled-gold w-100 mt-4 rounded-3"
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : (
                            <>
                                <FaSave className="me-2" />
                                Save Changes
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}
