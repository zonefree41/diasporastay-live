import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OwnerHotels() {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showDelete, setShowDelete] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    useEffect(() => {
        loadHotels();
    }, []);

    const loadHotels = async () => {
        try {
            const token = localStorage.getItem("ownerToken");
            const res = await fetch("/api/owner/hotels/my-hotels", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setHotels(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (hotel) => {
        setSelectedHotel(hotel);
        setShowDelete(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("ownerToken");
            await fetch(`/api/owner/hotels/${selectedHotel._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            setHotels((prev) =>
                prev.filter((h) => h._id !== selectedHotel._id)
            );
        } catch (err) {
            alert("Failed to delete hotel");
        } finally {
            setShowDelete(false);
            setSelectedHotel(null);
        }
    };

    if (loading) {
        return <p style={{ padding: 40 }}>Loading your hotels…</p>;
    }

    /* ================= EMPTY STATE ================= */
    if (hotels.length === 0) {
        return (
            <div style={emptyBox}>
                <h2 style={{ fontSize: 26, fontWeight: 700 }}>
                    No hotels yet
                </h2>
                <p style={{ marginTop: 10, color: "#6b7280" }}>
                    Add your first hotel to start earning on DiasporaStay.
                </p>
                <button
                    style={primaryBtn}
                    onClick={() => navigate("/owner/add-hotel")}
                >
                    ➕ Add Hotel
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 1100, margin: "40px auto", padding: 20 }}>
            <div style={header}>
                <h1 style={{ fontSize: 28, fontWeight: 700 }}>
                    My Hotels
                </h1>

                <button
                    style={primaryBtn}
                    onClick={() => navigate("/owner/add-hotel")}
                >
                    + Add Hotel
                </button>
            </div>

            <div style={grid}>
                {hotels.map((hotel) => (
                    <div key={hotel._id} style={card}>
                        {hotel.images?.[0] && (
                            <img
                                src={hotel.images[0]}
                                alt={hotel.name}
                                style={image}
                            />
                        )}

                        <div style={{ padding: 16 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 600 }}>
                                {hotel.name}
                            </h3>

                            <p style={{ color: "#6b7280", marginTop: 4 }}>
                                {hotel.city}, {hotel.country}
                            </p>

                            <p style={{ marginTop: 6, fontWeight: 600 }}>
                                ${hotel.pricePerNight} / night
                            </p>

                            {/* ACTIONS — MOBILE FRIENDLY */}
                            <div style={actions}>
                                <button
                                    style={{
                                        ...actionBtn,
                                        background: "#10b981",
                                        color: "#fff",
                                    }}
                                    onClick={() =>
                                        navigate(`/owner/hotels/${hotel._id}/availability`)
                                    }
                                >
                                    📅 Availability
                                </button>

                                <button
                                    style={actionBtn}
                                    onClick={() =>
                                        navigate(`/owner/hotels/${hotel._id}/edit`)
                                    }
                                >
                                    ✏️ Edit
                                </button>

                                <button
                                    style={{
                                        ...actionBtn,
                                        background: "#ef4444",
                                        color: "#fff",
                                    }}
                                    onClick={() => confirmDelete(hotel)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= DELETE MODAL ================= */}
            {showDelete && (
                <div style={modalOverlay}>
                    <div style={modal}>
                        <h3 style={{ fontSize: 20, fontWeight: 700 }}>
                            Delete Hotel?
                        </h3>
                        <p style={{ marginTop: 10 }}>
                            Are you sure you want to delete{" "}
                            <strong>{selectedHotel?.name}</strong>?
                            This action cannot be undone.
                        </p>

                        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                            <button
                                style={{ ...actionBtn, background: "#e5e7eb" }}
                                onClick={() => setShowDelete(false)}
                            >
                                Cancel
                            </button>

                            <button
                                style={{
                                    ...actionBtn,
                                    background: "#ef4444",
                                    color: "#fff",
                                }}
                                onClick={handleDelete}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ================= STYLES ================= */

const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    flexWrap: "wrap",
    gap: 12,
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
};

const card = {
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
};

const image = {
    width: "100%",
    height: 170,
    objectFit: "cover",
};

const actions = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 14,
};

const primaryBtn = {
    padding: "14px 20px",
    borderRadius: 14,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    minHeight: 48,
};

const actionBtn = {
    padding: "12px",
    borderRadius: 12,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    minHeight: 44,
};

const emptyBox = {
    maxWidth: 600,
    margin: "80px auto",
    padding: 40,
    textAlign: "center",
    border: "1px dashed #d1d5db",
    borderRadius: 24,
    background: "#fafafa",
};

const modalOverlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
};

const modal = {
    background: "#fff",
    padding: 30,
    borderRadius: 20,
    maxWidth: 420,
    width: "100%",
};
