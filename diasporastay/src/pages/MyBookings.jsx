// src/pages/MyBookings.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios";


export default function MyBookings() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("guestToken");

    useEffect(() => {
        if (!token) {
            navigate("/guest/login");
            return;
        }

        const load = async () => {
            try {
                const { data } = await api.get("/api/bookings/my");
                setItems(data);
                console.log("BOOKINGS:", data);
            } catch (e) {
                alert(e.message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [token, navigate]);

    if (loading) return <p style={{ padding: 40 }}>Loading…</p>;

    if (!items.length) {
        return (
            <div style={wrap}>
                <h2 style={{ margin: 0 }}>No bookings yet</h2>
                <p style={{ color: "#6b7280" }}>Start exploring stays today.</p>
                <Link to="/explore" style={btn}>Explore</Link>
            </div>
        );
    }

    return (
        <div style={page}>
            <h1 style={title}>My Bookings</h1>

            <div style={grid}>
                {items.map((b) => {
                    const snap = b.hotelSnapshot || {};
                    const hero = snap.images?.[0];

                    return (
                        <div key={b._id} style={card}>
                            {hero && <img src={hero} alt="" style={img} />}

                            <div style={{ padding: 14 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                                    <div style={{ fontWeight: 900 }}>{snap.name || "Hotel"}</div>
                                    <span style={badge(b.status)}>{b.status}</span>
                                </div>

                                <div style={muted}>
                                    {snap.city}, {snap.country}
                                </div>

                                <div style={{ marginTop: 10, fontWeight: 800 }}>
                                    {new Date(b.checkIn).toLocaleDateString()} →{" "}
                                    {new Date(b.checkOut).toLocaleDateString()}
                                </div>

                                <div style={{ marginTop: 6, fontWeight: 900 }}>
                                    Total: ${Number(b.totalPrice || 0).toFixed(2)}
                                </div>

                                {/* ACTIONS */}
                                <div style={actions}>
                                    <button
                                        style={primaryBtn}
                                        onClick={() => navigate(`/my-bookings/${b._id}`)}
                                    >
                                        View Booking
                                    </button>

                                    {b.hotel && (
                                        <button
                                            style={secondaryBtn}
                                            onClick={() => navigate(`/hotels/${b.hotel._id}`)}
                                        >
                                            View Hotel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ================= STYLES ================= */

const page = { maxWidth: 1000, margin: "40px auto", padding: 16 };
const title = { margin: 0, fontSize: 28, fontWeight: 900 };

const grid = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
};

const card = {
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 10px 24px rgba(0,0,0,.08)",
};

const img = { width: "100%", height: 160, objectFit: "cover" };
const muted = { marginTop: 6, color: "#6b7280", fontSize: 13 };

const actions = {
    marginTop: 14,
    display: "flex",
    gap: 10,
};

const primaryBtn = {
    flex: 1,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
};

const secondaryBtn = {
    flex: 1,
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #e5e7eb",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
};

const badge = (s) => ({
    fontSize: 11,
    padding: "5px 9px",
    borderRadius: 999,
    fontWeight: 900,
    background:
        s === "CANCELLED"
            ? "#fee2e2"
            : s === "CONFIRMED"
                ? "#dcfce7"
                : "#e0e7ff",
    color:
        s === "CANCELLED"
            ? "#991b1b"
            : s === "CONFIRMED"
                ? "#166534"
                : "#1e40af",
});

const wrap = {
    maxWidth: 700,
    margin: "60px auto",
    padding: 16,
    textAlign: "center",
};

const btn = {
    display: "inline-block",
    marginTop: 10,
    background: "#2563eb",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 900,
};
