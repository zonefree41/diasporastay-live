// src/pages/MyBookings.jsx
import { useEffect, useState } from "react";
import api from "../axios";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios
            .get(`${API}/api/bookings`)
            .then((res) => setBookings(res.data))
            .catch((err) => console.log("Bookings fetch error:", err));
    }, []);

    return (
        <div className="container py-4">
            <h2 className="mb-4">My Bookings</h2>

            {bookings.length === 0 ? (
                <p>No bookings yet.</p>
            ) : (
                <div className="list-group">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="list-group-item mb-2">
                            <h5>Hotel: {booking.hotelName || booking.hotelId}</h5>
                            <p>
                                <strong>Check-in:</strong>{" "}
                                {booking.checkIn ? new Date(booking.checkIn).toDateString() : "N/A"}
                            </p>
                            <p>
                                <strong>Check-out:</strong>{" "}
                                {booking.checkOut ? new Date(booking.checkOut).toDateString() : "N/A"}
                            </p>
                            <p>
                                <strong>Total Price:</strong> ${booking.totalPrice ?? 0}
                            </p>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}
