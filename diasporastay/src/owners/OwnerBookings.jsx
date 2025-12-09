// src/owners/OwnerBookings.jsx
import { useEffect, useState } from "react";
import api from "../axios";
import OwnerLayout from "./OwnerLayout";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function OwnerBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBookings = async () => {
        try {
            const token = localStorage.getItem("ownerToken");

            const res = await axios.get(`${API}/api/owner/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setBookings(res.data);
        } catch (err) {
            console.error("Error loading owner bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const statusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "badge bg-success";
            case "pending":
                return "badge bg-warning text-dark";
            case "cancelled":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    return (
        <OwnerLayout active="bookings">
            <h3 className="fw-bold mb-4">Bookings</h3>

            {loading && <p>Loading bookings...</p>}

            {!loading && bookings.length === 0 && (
                <p className="text-muted">No bookings yet.</p>
            )}

            <div className="row g-4">
                {bookings.map((b) => (
                    <div className="col-md-6" key={b._id}>
                        <div className="booking-card shadow-sm rounded-4 p-3">

                            {/* TOP ROW */}
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <h5 className="fw-bold m-0">{b.hotel?.name}</h5>
                                <span className={statusColor(b.status)}>
                                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                </span>
                            </div>

                            {/* LOCATION */}
                            <p className="text-muted mb-1">
                                <i className="bi bi-geo-alt"></i> {b.hotel?.city}, {b.hotel?.country}
                            </p>

                            {/* GUEST INFO */}
                            <div className="mt-2">
                                <p className="fw-semibold mb-1">
                                    <i className="bi bi-person"></i> Guest: {b.guestName}
                                </p>
                                <p className="text-muted mb-2" style={{ marginLeft: "22px" }}>
                                    {b.guestEmail}
                                </p>
                            </div>

                            {/* DATES */}
                            <div className="d-flex gap-4 mt-3">
                                <div>
                                    <p className="text-muted mb-1 small">Check-in</p>
                                    <p className="fw-semibold">
                                        {new Date(b.checkIn).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted mb-1 small">Check-out</p>
                                    <p className="fw-semibold">
                                        {new Date(b.checkOut).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* PRICE */}
                            <div className="mt-3">
                                <p className="fw-bold text-primary fs-5">
                                    ${b.totalPrice}
                                </p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/* STYLES */}
            <style>{`
                .booking-card {
                    background: #fff;
                    transition: transform 0.2s ease, box-shadow 0.2s;
                    border-radius: 18px;
                }

                .booking-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
                }

                .badge {
                    font-size: 0.8rem;
                    padding: 6px 10px;
                    border-radius: 20px;
                }
            `}</style>
        </OwnerLayout>
    );
}
