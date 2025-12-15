// src/pages/MyBookings.jsx
import { useEffect, useState } from "react";
import api from "../axios";
import { Link } from "react-router-dom";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const guestId = localStorage.getItem("guestId");

    const loadBookings = async () => {
        try {
            const res = await api.get(`/api/bookings/guest/${guestId}`);
            setBookings(res.data);
        } catch (err) {
            console.error("❌ Load guest bookings error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    if (loading) return <div className="container py-5">Loading bookings...</div>;

    if (!bookings.length)
        return (
            <div className="container py-5 text-center">
                <h3>No bookings yet</h3>
                <p className="text-muted">Start exploring stays today.</p>
                <Link className="btn btn-primary" to="/explore">
                    Browse Hotels
                </Link>
            </div>
        );

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4">My Bookings</h2>

            <div className="row g-4">
                {bookings.map((b) => (
                    <div className="col-md-6" key={b._id}>
                        <div className="card shadow-sm booking-card">

                            <img
                                src={b.hotelSnapshot.images?.[0]}
                                className="booking-img"
                                alt="hotel"
                            />

                            <div className="card-body">

                                <h4 className="fw-bold">{b.hotelSnapshot.name}</h4>
                                <p className="text-muted mb-1">
                                    {b.hotelSnapshot.city}, {b.hotelSnapshot.country}
                                </p>

                                <div className="mt-3">
                                    <p><strong>Check-in:</strong> {b.checkIn.slice(0, 10)}</p>
                                    <p><strong>Check-out:</strong> {b.checkOut.slice(0, 10)}</p>
                                    <p><strong>Nights:</strong> {b.nights}</p>

                                    <h5 className="fw-bold mt-2">${b.totalPrice}</h5>
                                </div>

                                <span
                                    className={`badge mt-2 ${b.paymentStatus === "paid"
                                            ? "bg-success"
                                            : b.paymentStatus === "pending"
                                                ? "bg-warning text-dark"
                                                : "bg-danger"
                                        }`}
                                >
                                    {b.paymentStatus.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .booking-card { border-radius: 14px; overflow: hidden; }
                .booking-img { width: 100%; height: 180px; object-fit: cover; }
            `}</style>
        </div>
    );
}
