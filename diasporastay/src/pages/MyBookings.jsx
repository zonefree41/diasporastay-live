// src/pages/MyBookings.jsx
import { useEffect, useState } from "react";
import api from "../axios";
import { FaCalendarAlt, FaHotel, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/theme.css";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const email = localStorage.getItem("guestEmail");

                const res = await api.get(`${API}/api/bookings/guest/${email}`);
                setBookings(res.data);
            } catch (err) {
                console.error("Bookings load error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, []);

    if (loading) {
        return <div className="luxury-loading">Loading bookings...</div>;
    }

    return (
        <div className="luxury-bookings-wrapper">

            <h2 className="luxury-title">My Bookings</h2>
            <p className="luxury-subtitle">View all your stays, past and upcoming.</p>

            {bookings.length === 0 && (
                <p className="text-center text-light mt-5 opacity-75 fs-5">
                    You have no bookings yet.
                </p>
            )}

            <div className="booking-list">
                {bookings.map((b, index) => {
                    const dateIn = new Date(b.checkIn).toLocaleDateString();
                    const dateOut = new Date(b.checkOut).toLocaleDateString();

                    const isPast = new Date(b.checkOut) < new Date();
                    const status = isPast ? "Completed" : "Upcoming";

                    return (
                        <div key={index} className="booking-card">

                            {/* Left: Image */}
                            <div className="booking-image">
                                <img
                                    src={b.hotel?.images?.[0]}
                                    alt="hotel"
                                    className="booking-img"
                                />
                            </div>

                            {/* Right: Text info */}
                            <div className="booking-info">

                                <h4 className="booking-hotel">
                                    <FaHotel className="me-2 text-gold" />
                                    {b.hotel?.name}
                                </h4>

                                <p className="booking-location">
                                    <FaMapMarkerAlt className="me-2 text-gold" />
                                    {b.hotel?.city}, {b.hotel?.country}
                                </p>

                                <div className="booking-dates mt-3">
                                    <div>
                                        <span className="date-label">Check-In</span>
                                        <p className="date-value">
                                            <FaCalendarAlt className="me-2 text-gold" />
                                            {dateIn}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="date-label">Check-Out</span>
                                        <p className="date-value">
                                            <FaCalendarAlt className="me-2 text-gold" />
                                            {dateOut}
                                        </p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className={`booking-status ${isPast ? "completed" : "upcoming"}`}>
                                    {status}
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
