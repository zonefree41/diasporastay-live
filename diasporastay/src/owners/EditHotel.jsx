// src/owners/EditHotel.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import RefundPolicySelector from "../components/RefundPolicySelector";



/* ================= STYLES ================= */

const page = { maxWidth: 1200, margin: "40px auto", padding: 20 };
const title = { fontSize: 30, fontWeight: 800, marginBottom: 20 };

const layout = {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: 30,
};

const section = {
    background: "#fff",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 8px 30px rgba(0,0,0,.06)",
    marginBottom: 20,
};

const sectionTitle = { fontSize: 18, fontWeight: 700, marginBottom: 14 };

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

const previewCard = {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,.12)",
};

const previewImage = { width: "100%", height: 180, objectFit: "cover" };
const previewBody = { padding: 14 };
const muted = { color: "#6b7280", fontSize: 13 };

/* ================= COMPONENT ================= */

export default function EditHotel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [description, setDescription] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [minNights, setMinNights] = useState(2);

    const [refundPolicy, setRefundPolicy] = useState("MODERATE_48H");

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    /* ===== LOAD HOTEL ===== */
    useEffect(() => {
        const loadHotel = async () => {
            try {
                const { data } = await api.get(`/api/owner/hotels/${id}`);

                setName(data.name);
                setCity(data.city);
                setCountry(data.country);
                setDescription(data.description || "");
                setPricePerNight(data.pricePerNight);
                setMinNights(data.minNights || 2);
                setRefundPolicy(data.refundPolicy || "MODERATE_48H");
                setExistingImages(data.images || []);
            } catch (err) {
                console.error(err);
                setError("Unable to load hotel.");
            } finally {
                setLoading(false);
            }
        };

        loadHotel();
    }, [id]);

    /* ===== SAVE ===== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("city", city);
            formData.append("country", country);
            formData.append("description", description);
            formData.append("pricePerNight", pricePerNight);
            formData.append("minNights", minNights);
            formData.append("refundPolicy", refundPolicy);

            existingImages.forEach((img) =>
                formData.append("existingImages[]", img)
            );

            Array.from(newImages).forEach((file) =>
                formData.append("images", file)
            );

            await api.put(`/api/hotels/${id}`, formData);

            alert("Hotel updated successfully");
            navigate("/owner/my-hotels");
        } catch (err) {
            console.error(err);
            alert("Failed to update hotel");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
    if (error) return <p style={{ padding: 40, color: "red" }}>{error}</p>;

    return (
        <div style={page}>
            <h1 style={title}>Edit Hotel</h1>

            <div style={layout}>
                {/* ===== FORM ===== */}
                <form onSubmit={handleSubmit}>
                    <div style={section}>
                        <h3 style={sectionTitle}>Basic Info</h3>
                        <input style={input} value={name} onChange={(e) => setName(e.target.value)} />
                        <div style={row}>
                            <input style={input} value={city} onChange={(e) => setCity(e.target.value)} />
                            <input style={input} value={country} onChange={(e) => setCountry(e.target.value)} />
                        </div>
                        <textarea
                            style={{ ...input, marginTop: 12 }}
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div style={section}>
                        <h3 style={sectionTitle}>Pricing</h3>
                        <div style={row}>
                            <input style={input} type="number" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} />
                            <input style={input} type="number" value={minNights} onChange={(e) => setMinNights(e.target.value)} />
                        </div>

                        <div style={{ marginTop: 14 }}>
                            <strong>Refund policy</strong>
                            <RefundPolicySelector
                                value={refundPolicy}
                                onChange={setRefundPolicy}
                            />
                        </div>
                    </div>

                    <div style={section}>
                        <h3 style={sectionTitle}>Photos</h3>
                        <div style={imageGrid}>
                            {existingImages.map((img) => (
                                <div key={img} style={imageWrap}>
                                    <img src={img} style={image} />
                                    <button
                                        type="button"
                                        style={removeBtn}
                                        onClick={() =>
                                            setExistingImages(existingImages.filter((i) => i !== img))
                                        }
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <label style={uploadBox}>
                            + Add photos
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                hidden
                                onChange={(e) => setNewImages(e.target.files)}
                            />
                        </label>
                    </div>

                    <button disabled={saving} style={saveBtn}>
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </form>

                {/* ===== PREVIEW ===== */}
                <div>
                    <div style={previewCard}>
                        {existingImages[0] && (
                            <img src={existingImages[0]} style={previewImage} />
                        )}
                        <div style={previewBody}>
                            <h4>{name}</h4>
                            <p style={muted}>{city}, {country}</p>
                            <strong>${pricePerNight}</strong> / night
                            <p style={muted}>Min {minNights} nights</p>
                            <p style={muted}>
                                {refundPolicy === "FLEXIBLE_24H" && "Free cancellation up to 24h"}
                                {refundPolicy === "MODERATE_48H" && "Free cancellation up to 48h"}
                                {refundPolicy === "NON_REFUNDABLE" && "Non-refundable"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
