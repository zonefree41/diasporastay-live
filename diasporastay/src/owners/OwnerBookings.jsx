// src/owners/OwnerBookings.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function OwnerBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("ownerToken");

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/owner/bookings`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setBookings(res.data || []);
        } catch (err) {
            console.error("Failed to load bookings", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading bookings...</p>;

    if (!bookings.length) {
        return (
            <div className="text-center py-5">
                <h4>📅 No bookings yet</h4>
                <p className="text-muted">
                    When guests book your hotel, their stays will appear here.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h4 className="mb-4">Bookings</h4>

            {bookings.map((b) => (
                <div key={b._id} className="card mb-3 p-3">
                    <h6 className="fw-bold">
                        🏨 {b.hotel?.name || "Hotel"}
                    </h6>

                    <div className="text-muted small">
                        👤 Guest: {b.guestId?.email || "Guest"}
                    </div>

                    <div className="mt-1">
                        {new Date(b.checkIn).toLocaleDateString()} →{" "}
                        {new Date(b.checkOut).toLocaleDateString()}
                    </div>

                    <span
                        style={{
                            marginTop: 6,
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: 999,
                            background:
                                b.status === "cancelled" ? "#fee2e2" : "#dcfce7",
                            color:
                                b.status === "cancelled" ? "#991b1b" : "#166534",
                            fontWeight: 800,
                            fontSize: 12,
                        }}
                    >
                        {b.status.toUpperCase()}
                    </span>
                </div>
            ))}
        </div>
    );
}
