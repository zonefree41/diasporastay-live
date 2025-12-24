import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";

/* ================= STYLES ================= */

const page = { maxWidth: 1200, margin: "40px auto", padding: 20 };
const title = { fontSize: 30, fontWeight: 800, marginBottom: 20 };

const toggleWrap = { display: "flex", gap: 10, marginBottom: 20 };
const toggleBtn = {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
};

const layout = {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: 30,
};

const form = { display: "flex", flexDirection: "column", gap: 24 };

const section = {
    background: "#fff",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 8px 30px rgba(0,0,0,.06)",
};

const sectionTitle = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
};

const input = {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #d1d5db",
};

const row = { display: "flex", gap: 12 };

const imageGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: 10,
};

const imageWrap = { position: "relative" };
const image = { width: "100%", height: 80, objectFit: "cover", borderRadius: 10 };

const removeBtn = {
    position: "absolute",
    top: 4,
    right: 4,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 22,
    height: 22,
    cursor: "pointer",
};

const uploadBox = {
    padding: 16,
    border: "2px dashed #d1d5db",
    borderRadius: 14,
    textAlign: "center",
    cursor: "pointer",
    fontWeight: 600,
};

const saveBtn = {
    padding: 16,
    borderRadius: 16,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
};

const previewWrap = { position: "sticky", top: 20 };

const explorePreviewWrap = { transition: "all .25s ease" };

const exploreCard = {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,.12)",
};

const exploreImage = { width: "100%", height: 160, objectFit: "cover" };
const exploreBody = { padding: 14 };
const exploreLocation = { color: "#6b7280", fontSize: 13 };
const exploreMin = { fontSize: 12, color: "#6b7280" };

const ratingRow = { display: "flex", alignItems: "center", gap: 6 };
const ratingStar = { color: "#f59e0b" };
const ratingValue = { fontWeight: 700 };
const ratingReviews = { fontSize: 12, color: "#6b7280" };

const availabilityWrap = {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    background: "#f9fafb",
};

const availabilityGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 6,
};

const availabilityDay = {
    padding: "8px 0",
    borderRadius: 8,
    fontSize: 11,
    textAlign: "center",
    fontWeight: 600,
};

/* ================= COMPONENT ================= */

export default function EditHotel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [previewMode, setPreviewMode] = useState("desktop");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [description, setDescription] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [minNights, setMinNights] = useState(2);

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const loadHotel = async () => {
            try {
                setError(null);

                const { data } = await api.get(`/api/hotels/${id}`);
                setHotel(data);
            } catch (err) {
                console.error("LOAD HOTEL ERROR:", err);
                setError("Unable to load hotel details.");
            } finally {
                setLoading(false);
            }
        };

        loadHotel();
    }, [id]);

    const loadHotel = async () => {
        try {
            const token = localStorage.getItem("ownerToken");
            const res = await fetch(`/api/owner/hotels/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            setName(data.name);
            setCity(data.city);
            setCountry(data.country);
            setDescription(data.description || "");
            setPricePerNight(data.pricePerNight);
            setMinNights(data.minNights || 2);
            setExistingImages(data.images || []);
        } catch {
            alert("Failed to load hotel");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("city", city);
            formData.append("country", country);
            formData.append("pricePerNight", pricePerNight);
            formData.append("minNights", minNights);
            formData.append("description", description);

            // 👇 THIS IS THE CRITICAL PART
            if (images && images.length > 0) {
                for (const file of images) {
                    formData.append("images", file);
                }
            }

            await api.put(`/api/hotels/${id}`, formData);

            alert("Hotel updated successfully");
            navigate("/owner/my-hotels");
        } catch (err) {
            console.error(err);
            alert(
                err?.response?.data?.message || "Failed to update hotel"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p style={{ padding: 40 }}>Loading hotel…</p>;
    }

    if (error) {
        return (
            <div style={{ padding: 40 }}>
                <p style={{ color: "red", fontWeight: 600 }}>{error}</p>
                <button onClick={() => navigate("/owner/my-hotels")}>
                    Back to My Hotels
                </button>
            </div>
        );
    }

    return (
        <div style={page}>
            <h1 style={title}>Edit Hotel</h1>

            <div style={toggleWrap}>
                <button
                    onClick={() => setPreviewMode("desktop")}
                    style={{
                        ...toggleBtn,
                        background: previewMode === "desktop" ? "#2563eb" : "#e5e7eb",
                        color: previewMode === "desktop" ? "#fff" : "#111",
                    }}
                >
                    🖥 Desktop
                </button>
                <button
                    onClick={() => setPreviewMode("mobile")}
                    style={{
                        ...toggleBtn,
                        background: previewMode === "mobile" ? "#2563eb" : "#e5e7eb",
                        color: previewMode === "mobile" ? "#fff" : "#111",
                    }}
                >
                    📱 Mobile
                </button>
            </div>

            <div style={layout}>
                <form onSubmit={handleSubmit} style={form}>
                    <div style={section}>
                        <h3 style={sectionTitle}>Basic Info</h3>
                        <input style={input} value={name} onChange={(e) => setName(e.target.value)} />
                        <div style={row}>
                            <input style={input} value={city} onChange={(e) => setCity(e.target.value)} />
                            <input style={input} value={country} onChange={(e) => setCountry(e.target.value)} />
                        </div>
                    </div>

                    <div style={section}>
                        <h3 style={sectionTitle}>Pricing</h3>
                        <div style={row}>
                            <input style={input} type="number" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} />
                            <input style={input} type="number" value={minNights} onChange={(e) => setMinNights(e.target.value)} />
                        </div>
                    </div>

                    <div style={section}>
                        <h3 style={sectionTitle}>Photos</h3>
                        <div style={imageGrid}>
                            {existingImages.map((img) => (
                                <div key={img} style={imageWrap}>
                                    <img src={img} style={image} />
                                    <button type="button" style={removeBtn} onClick={() => setExistingImages(existingImages.filter((i) => i !== img))}>×</button>
                                </div>
                            ))}
                        </div>
                        <label style={uploadBox}>
                            + Add photos
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setImages(e.target.files)}
                            />
                        </label>
                    </div>

                    <button disabled={saving} style={saveBtn}>
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </form>

                <div style={previewWrap}>
                    <div
                        style={{
                            ...explorePreviewWrap,
                            width: previewMode === "mobile" ? 320 : "100%",
                            margin: "0 auto",
                        }}
                    >
                        <div style={exploreCard}>
                            <img src={existingImages[0]} style={exploreImage} />
                            <div style={exploreBody}>
                                <div style={ratingRow}>
                                    <span style={ratingStar}>★</span>
                                    <span style={ratingValue}>4.8</span>
                                    <span style={ratingReviews}>(32 reviews)</span>
                                </div>
                                <h4>{name}</h4>
                                <p style={exploreLocation}>{city}, {country}</p>
                                <strong>${pricePerNight}</strong> / night
                                <p style={exploreMin}>Min {minNights} nights</p>
                            </div>
                        </div>

                        <div style={availabilityWrap}>
                            <div style={availabilityGrid}>
                                {Array.from({ length: 14 }).map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            ...availabilityDay,
                                            background: i % 5 === 0 ? "#fee2e2" : "#dcfce7",
                                        }}
                                    >
                                        {i % 5 === 0 ? "Blocked" : "Available"}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
