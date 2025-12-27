import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import CancelBookingModal from "../components/CancelBookingModal";
import BookingChat from "../components/BookingChat";

export default function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showCancel, setShowCancel] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get(`/api/bookings/${id}`);
                setBooking(data);
            } catch {
                alert("Unable to load booking details.");
                navigate("/my-bookings");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, navigate]);

    if (loading) return <p style={{ padding: 40 }}>Loading booking…</p>;
    if (!booking) return null;

    const snap = booking.hotelSnapshot || {};
    const hero = snap.images?.[0];
    const nights =
        (new Date(booking.checkOut) - new Date(booking.checkIn)) /
        (1000 * 60 * 60 * 24);

    const handleCancel = async () => {
        try {
            setCancelLoading(true);
            await api.put(`/api/bookings/cancel/${booking._id}`);
            alert("Booking cancelled. Refund initiated.");
            navigate("/my-bookings");
        } catch (err) {
            alert(err?.response?.data?.message || "Cancellation failed");
        } finally {
            setCancelLoading(false);
            setShowCancel(false);
        }
    };

    return (
        <div style={page}>
            {/* HERO IMAGE */}
            {hero && <img src={hero} alt="" style={heroImg} />}

            <div style={content}>
                {/* HEADER */}
                <div style={header}>
                    <h1 style={title}>{snap.name || "Your stay"}</h1>
                    <span style={badge(booking.status)}>
                        {booking.status}
                    </span>
                </div>

                <p style={muted}>
                    {snap.city}, {snap.country}
                </p>

                {/* DATES */}
                <div style={card}>
                    <h3>📅 Your trip</h3>
                    <p>
                        <strong>Check-in:</strong>{" "}
                        {new Date(booking.checkIn).toDateString()}
                    </p>
                    <p>
                        <strong>Check-out:</strong>{" "}
                        {new Date(booking.checkOut).toDateString()}
                    </p>
                    <p>
                        <strong>Nights:</strong> {nights}
                    </p>
                </div>

                {/* PRICE */}
                <div style={card}>
                    <h3>💳 Price details</h3>
                    <p>
                        ${Number(booking.pricePerNight).toFixed(2)} × {nights} nights
                    </p>
                    <hr />
                    <p style={{ fontWeight: 900 }}>
                        Total: ${Number(booking.totalPrice).toFixed(2)}
                    </p>
                </div>

                {/* ACTIONS */}
                <div style={actions}>
                    {booking.hotel && (
                        <button
                            style={primaryBtn}
                            onClick={() => navigate(`/hotels/${booking.hotel._id}`)}
                        >
                            View Hotel
                        </button>
                    )}

                    <button
                        style={secondaryBtn}
                        onClick={() => navigate("/my-bookings")}
                    >
                        Back to bookings
                    </button>

                    {booking.status !== "CANCELLED" && (
                        <button
                            style={{
                                ...secondaryBtn,
                                background: "#fee2e2",
                                color: "#991b1b",
                                border: "1px solid #fecaca",
                            }}
                            onClick={() => setShowCancel(true)}
                        >
                            Cancel Booking
                        </button>
                    )}

                    <button
                        style={primaryBtn}
                        onClick={() => {
                            const email =
                                booking.ownerEmail || "support@diasporastay.com";
                            window.location.href = `mailto:${email}?subject=Booking ${booking._id}`;
                        }}
                    >
                        Message Host
                    </button>

                    <button
                        style={primaryBtn}
                        onClick={() => navigate(`/messages/${booking._id}`)}
                    >
                        Message Host
                    </button>

                </div>

                <BookingChat
                    bookingId={booking._id}
                    role="guest"
                    senderId={booking.guestId}
                />

                {booking.refundStatus && (
                    <div style={{ marginTop: 10, fontSize: 13, color: "#16a34a" }}>
                        💳 Refund status: {booking.refundStatus}
                    </div>
                )}
            </div>

            {/* CANCEL MODAL */}
            {showCancel && (
                <CancelBookingModal
                    booking={booking}
                    loading={cancelLoading}
                    onClose={() => setShowCancel(false)}
                    onConfirm={handleCancel}
                />
            )}
        </div>
    );
}

/* ================= STYLES ================= */

const page = {
    maxWidth: 900,
    margin: "30px auto",
    padding: 16,
};

const heroImg = {
    width: "100%",
    height: 320,
    objectFit: "cover",
    borderRadius: 22,
};

const content = {
    marginTop: 24,
};

const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
};

const title = {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
};

const muted = {
    color: "#6b7280",
    marginTop: 4,
};

const card = {
    marginTop: 18,
    padding: 18,
    borderRadius: 18,
    background: "#fff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 24px rgba(0,0,0,.06)",
};

const actions = {
    marginTop: 24,
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
};

const primaryBtn = {
    flex: 1,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "14px 16px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: "pointer",
};

const secondaryBtn = {
    flex: 1,
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #e5e7eb",
    padding: "14px 16px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: "pointer",
};

const badge = (s) => ({
    fontSize: 12,
    padding: "6px 12px",
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
