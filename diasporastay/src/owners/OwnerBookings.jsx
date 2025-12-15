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

    // ✅ EMPTY STATE
    if (bookings.length === 0) {
        return (
            <div className="text-center py-5">
                <h4 className="mb-3">📅 No bookings yet</h4>
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
                    <strong>{b.guestName || "Guest"}</strong>
                    <div className="text-muted">
                        {new Date(b.checkIn).toLocaleDateString()} →{" "}
                        {new Date(b.checkOut).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
