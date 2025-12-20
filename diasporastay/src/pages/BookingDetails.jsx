// src/pages/BookingDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const token = localStorage.getItem("guestToken");

    useEffect(() => {
        if (!token) {
            navigate("/guest/login");
            return;
        }

        const load = async () => {
            try {
                const res = await fetch(`/api/bookings/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || "Failed to load booking");
                setBooking(data);
            } catch (e) {
                alert(e.message);
                navigate("/my-bookings");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, token, navigate]);

    const canCancel = useMemo(() => {
        if (!booking) return false;
        if (booking.status === "CANCELLED") return false;
        const checkIn = new Date(booking.checkIn);
        return checkIn > new Date();
    }, [booking]);

    const handleCancel = async () => {
        if (!canCancel) return;

        const ok = confirm("Cancel this booking? This will free your blocked dates.");
        if (!ok) return;

        setBusy(true);
        try {
            const res = await fetch(`/api/bookings/${id}/cancel`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Cancel failed");
            setBooking(data.booking);
            alert("Booking cancelled.");
        } catch (e) {
            alert(e.message);
        } finally {
            setBusy(false);
        }
    };

    if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
    if (!booking) return <p style={{ padding: 40 }}>Booking not found</p>;

    const snap = booking.hotelSnapshot || {};
    const hero = snap.images?.[0];

    return (
        <div style={page}>
            <div style={topRow}>
                <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>
                <Link to="/my-bookings" style={linkBtn}>My Bookings</Link>
            </div>

            <div style={card}>
                {hero && <img src={hero} alt="hotel" style={heroImg} />}

                <div style={{ padding: 18 }}>
                    <h1 style={h1}>{snap.name || "Hotel"}</h1>
                    <div style={muted}>{snap.city}, {snap.country}</div>

                    <div style={grid}>
                        <div style={box}>
                            <div style={label}>Check-in</div>
                            <div style={value}>{new Date(booking.checkIn).toLocaleDateString()}</div>
                        </div>
                        <div style={box}>
                            <div style={label}>Check-out</div>
                            <div style={value}>{new Date(booking.checkOut).toLocaleDateString()}</div>
                        </div>
                        <div style={box}>
                            <div style={label}>Nights</div>
                            <div style={value}>{booking.nights}</div>
                        </div>
                        <div style={box}>
                            <div style={label}>Total</div>
                            <div style={value}>${Number(booking.totalPrice || 0).toFixed(2)}</div>
                        </div>
                    </div>

                    <div style={statusRow}>
                        <span style={badge(booking.status)}>{booking.status}</span>
                        <span style={subBadge}>{booking.paymentStatus}</span>
                    </div>

                    <div style={actions}>
                        <Link to={`/hotels/${booking.hotel}`} style={primaryLink}>
                            View Hotel
                        </Link>

                        <button
                            onClick={handleCancel}
                            disabled={!canCancel || busy}
                            style={{
                                ...dangerBtn,
                                opacity: !canCancel || busy ? 0.55 : 1,
                                cursor: !canCancel || busy ? "not-allowed" : "pointer",
                            }}
                        >
                            {busy ? "Cancelling…" : "Cancel Booking"}
                        </button>
                    </div>

                    {!canCancel && booking.status !== "CANCELLED" && (
                        <p style={hint}>Cancellation is only available before the check-in date.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* styles */
const page = { maxWidth: 900, margin: "40px auto", padding: 16 };
const topRow = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 };
const backBtn = { border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px", background: "#fff", cursor: "pointer", fontWeight: 700 };
const linkBtn = { textDecoration: "none", border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px", background: "#fff", fontWeight: 700, color: "#111827" };

const card = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, overflow: "hidden", boxShadow: "0 12px 30px rgba(0,0,0,.08)" };
const heroImg = { width: "100%", height: 280, objectFit: "cover" };
const h1 = { fontSize: 26, fontWeight: 900, margin: 0 };
const muted = { color: "#6b7280", marginTop: 6 };

const grid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 16 };
const box = { border: "1px solid #e5e7eb", borderRadius: 14, padding: 12, background: "#f9fafb" };
const label = { fontSize: 12, color: "#6b7280", fontWeight: 700 };
const value = { fontSize: 16, fontWeight: 900, marginTop: 4 };

const statusRow = { display: "flex", gap: 10, alignItems: "center", marginTop: 14 };
const subBadge = { fontSize: 12, padding: "6px 10px", borderRadius: 999, background: "#f3f4f6", fontWeight: 800, color: "#374151" };
const badge = (s) => ({
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
    background: s === "CANCELLED" ? "#fee2e2" : s === "CONFIRMED" ? "#dcfce7" : "#e0e7ff",
    color: s === "CANCELLED" ? "#991b1b" : s === "CONFIRMED" ? "#166534" : "#1e40af",
});

const actions = { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" };
const primaryLink = { textDecoration: "none", background: "#2563eb", color: "#fff", fontWeight: 900, padding: "12px 14px", borderRadius: 14 };
const dangerBtn = { border: "1px solid #ef4444", background: "#fff", color: "#b91c1c", fontWeight: 900, padding: "12px 14px", borderRadius: 14 };
const hint = { marginTop: 12, color: "#6b7280", fontSize: 13 };
