// src/owners/EditHotel.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import OwnerLayout from "./OwnerLayout";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function EditHotel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        city: "",
        country: "",
        pricePerNight: "",
        description: "",
        amenities: [],
        images: [],
    });

    const [newImages, setNewImages] = useState([]);

    const amenitiesList = [
        "Free WiFi",
        "Parking",
        "Airport Shuttle",
        "Swimming Pool",
        "Restaurant",
        "Fitness Center",
        "Air Conditioning",
        "Room Service",
    ];

    // Load hotel
    useEffect(() => {
        const loadHotel = async () => {
            try {
                const res = await axios.get(`${API}/api/hotels/${id}`);
                setForm(res.data);
            } catch (err) {
                console.error("Error loading hotel:", err);
                alert("Could not load hotel");
            } finally {
                setLoading(false);
            }
        };
        loadHotel();
    }, [id]);

    const updateField = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleAmenity = (a) => {
        setForm({
            ...form,
            amenities: form.amenities.includes(a)
                ? form.amenities.filter((x) => x !== a)
                : [...form.amenities, a],
        });
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setNewImages([...newImages, ...files]);
    };

    // Upload new images to Cloudinary
    const uploadImagesToCloudinary = async () => {
        const urls = [];
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        for (const file of newImages) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", preset);

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                data
            );

            urls.push(res.data.secure_url);
        }

        return urls;
    };

    const removeOldImage = (url) => {
        setForm({
            ...form,
            images: form.images.filter((img) => img !== url),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let newImageUrls = [];
            if (newImages.length > 0) {
                newImageUrls = await uploadImagesToCloudinary();
            }

            const token = localStorage.getItem("ownerToken");

            const payload = {
                ...form,
                images: [...form.images, ...newImageUrls],
            };

            await axios.patch(
                `${API}/api/owner/hotels/${id}/edit`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Hotel updated successfully!");
            navigate("/owner/my-hotels");

        } catch (err) {
            console.error("Error updating hotel:", err);
            alert("Failed to update hotel");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <OwnerLayout>
                <h4>Loading hotel...</h4>
            </OwnerLayout>
        );
    }

    return (
        <OwnerLayout active="my-hotels">
            <h3 className="fw-bold mb-4">Edit Hotel</h3>

            <form onSubmit={handleSubmit} className="row g-4">

                {/* TEXT FIELDS */}
                <div className="col-md-6">
                    <label className="form-label fw-semibold">Hotel Name</label>
                    <input
                        name="name"
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={updateField}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-semibold">City</label>
                    <input
                        name="city"
                        type="text"
                        className="form-control"
                        value={form.city}
                        onChange={updateField}
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-semibold">Country</label>
                    <input
                        name="country"
                        type="text"
                        className="form-control"
                        value={form.country}
                        onChange={updateField}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold">Price Per Night ($)</label>
                    <input
                        name="pricePerNight"
                        type="number"
                        className="form-control"
                        value={form.pricePerNight}
                        onChange={updateField}
                    />
                </div>

                <div className="col-md-8">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                        name="description"
                        rows="3"
                        className="form-control"
                        value={form.description}
                        onChange={updateField}
                    ></textarea>
                </div>

                {/* AMENITIES */}
                <div className="col-12">
                    <label className="form-label fw-semibold">Amenities</label>
                    <div className="d-flex flex-wrap gap-2">
                        {amenitiesList.map((a) => (
                            <span
                                key={a}
                                onClick={() => toggleAmenity(a)}
                                className={
                                    "amenity-pill " +
                                    (form.amenities.includes(a)
                                        ? "amenity-active"
                                        : "")
                                }
                            >
                                {a}
                            </span>
                        ))}
                    </div>
                </div>

                {/* EXISTING IMAGES */}
                <div className="col-12">
                    <label className="form-label fw-semibold">Current Images</label>

                    <div className="d-flex flex-wrap gap-3">
                        {form.images.map((url, i) => (
                            <div key={i} className="img-box position-relative">
                                <img src={url} className="img-thumb" />

                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => removeOldImage(url)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEW IMAGES */}
                <div className="col-12">
                    <label className="form-label fw-semibold">Add New Images</label>
                    <input
                        type="file"
                        multiple
                        className="form-control"
                        onChange={handleImageSelect}
                    />

                    <div className="d-flex flex-wrap gap-3 mt-3">
                        {newImages.map((file, i) => (
                            <img
                                key={i}
                                src={URL.createObjectURL(file)}
                                className="img-thumb"
                            />
                        ))}
                    </div>
                </div>

                <div className="col-12">
                    <button className="btn btn-primary px-4 py-2 rounded-pill" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>

            {/* CSS */}
            <style>
                {`
                .img-thumb {
                    width: 140px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 10px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
                    transition: transform 0.25s;
                }

                .img-thumb:hover {
                    transform: scale(1.05);
                }

                .img-box {
                    position: relative;
                    display: inline-block;
                }

                .delete-btn {
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    background: rgba(0,0,0,0.6);
                    border: none;
                    color: white;
                    padding: 6px 8px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .delete-btn:hover {
                    background: rgba(255,0,0,0.8);
                }

                .amenity-pill {
                    padding: 7px 14px;
                    border-radius: 50px;
                    background: #f1f1f1;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.25s;
                }

                .amenity-active {
                    background: #007bff;
                    color: white;
                }

                .amenity-pill:hover {
                    background: #e5e5e5;
                }
            `}
            </style>
        </OwnerLayout>
    );
}
