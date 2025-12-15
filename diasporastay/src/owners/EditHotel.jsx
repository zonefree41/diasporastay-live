// src/owners/EditHotel.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import OwnerLayout from "./OwnerLayout";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function EditHotel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [description, setDescription] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [images, setImages] = useState([]);

    const [newImages, setNewImages] = useState([]); // files to upload
    const [previewImages, setPreviewImages] = useState([]); // local previews

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    /* ====================================================================
       LOAD HOTEL DATA
    ==================================================================== */
    const loadHotel = async () => {
        try {
            const token = localStorage.getItem("ownerToken");

            const res = await api.get(`/api/owner/hotels/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const h = res.data;
            setHotel(h);

            setName(h.name);
            setCity(h.city);
            setCountry(h.country);
            setPricePerNight(h.pricePerNight);
            setDescription(h.description);
            setAmenities(h.amenities || []);
            setImages(h.images || []);

        } catch (err) {
            console.error("❌ Load hotel error:", err.response?.data);
            setError("Failed to load hotel.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHotel();
    }, []);

    /* ====================================================================
       IMAGE UPLOAD TO CLOUDINARY
    ==================================================================== */
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const uploadToCloudinary = async () => {
        if (newImages.length === 0) return [];

        const uploadedUrls = [];

        for (let img of newImages) {
            const formData = new FormData();
            formData.append("file", img);
            formData.append("upload_preset", "diasporastay"); // change if needed

            const uploadRes = await fetch(
                "https://api.cloudinary.com/v1_1/diasporastay/image/upload",
                { method: "POST", body: formData }
            );

            const data = await uploadRes.json();
            uploadedUrls.push(data.secure_url);
        }

        return uploadedUrls;
    };

    /* ====================================================================
       SAVE HOTEL CHANGES
    ==================================================================== */
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("ownerToken");

            // Upload new images if selected
            const newImageUrls = await uploadToCloudinary();

            const payload = {
                name,
                city,
                country,
                pricePerNight,
                description,
                amenities,
                images: [...images, ...newImageUrls],
            };

            await api.put(`/api/owner/hotels/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Hotel updated successfully!");
            navigate("/owner/my-hotels");

        } catch (err) {
            console.error("❌ Save hotel error:", err.response?.data);
            setError("Failed to update hotel.");
        } finally {
            setSaving(false);
        }
    };

    /* ====================================================================
       AMENITIES HANDLER
    ==================================================================== */
    const toggleAmenity = (item) => {
        if (amenities.includes(item)) {
            setAmenities(amenities.filter((a) => a !== item));
        } else {
            setAmenities([...amenities, item]);
        }
    };

    if (loading) {
        return (
            <OwnerLayout>
                <p className="text-muted">Loading hotel...</p>
            </OwnerLayout>
        );
    }

    if (!hotel) {
        return (
            <OwnerLayout>
                <p className="text-danger">Hotel not found.</p>
            </OwnerLayout>
        );
    }

    /* ====================================================================
       RENDER UI
    ==================================================================== */
    return (
        <OwnerLayout>
            <h3 className="fw-bold mb-4">Edit Hotel</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSave}>

                {/* NAME */}
                <div className="mb-3">
                    <label className="fw-semibold">Hotel Name</label>
                    <input
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                {/* CITY */}
                <div className="mb-3">
                    <label className="fw-semibold">City</label>
                    <input
                        className="form-control"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </div>

                {/* COUNTRY */}
                <div className="mb-3">
                    <label className="fw-semibold">Country</label>
                    <input
                        className="form-control"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </div>

                {/* PRICE */}
                <div className="mb-3">
                    <label className="fw-semibold">Price / Night ($)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={pricePerNight}
                        onChange={(e) => setPricePerNight(e.target.value)}
                        required
                    />
                </div>

                {/* DESCRIPTION */}
                <div className="mb-3">
                    <label className="fw-semibold">Description</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* AMENITIES */}
                <div className="mb-4">
                    <label className="fw-semibold d-block mb-2">Amenities</label>
                    {["Wifi", "Breakfast", "Parking", "Pool", "Gym"].map((amen) => (
                        <div key={amen} className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={amenities.includes(amen)}
                                onChange={() => toggleAmenity(amen)}
                            />
                            <label className="form-check-label">{amen}</label>
                        </div>
                    ))}
                </div>

                {/* EXISTING IMAGES */}
                <label className="fw-semibold">Existing Images</label>
                <div className="d-flex gap-3 mb-3 flex-wrap">
                    {images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt="hotel"
                            className="rounded"
                            style={{ width: "120px", height: "90px", objectFit: "cover" }}
                        />
                    ))}
                </div>

                {/* NEW IMAGES */}
                <div className="mb-4">
                    <label className="fw-semibold">Upload More Images</label>
                    <input
                        type="file"
                        multiple
                        className="form-control"
                        onChange={handleImageUpload}
                    />

                    {/* Preview */}
                    {previewImages.length > 0 && (
                        <div className="d-flex gap-3 mt-3 flex-wrap">
                            {previewImages.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    style={{
                                        width: "120px",
                                        height: "90px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* BUTTON */}
                <button className="btn btn-primary mt-3" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </OwnerLayout>
    );
}
